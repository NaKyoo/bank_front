# create_secondaries_for_last_users.ps1
# Reads last_created_users.json and attempts to create secondary accounts via POST /accounts/open
# Tries without Authorization first, then with Bearer token if available

$metaPath = Join-Path $PSScriptRoot 'last_created_users.json'
$outPath = Join-Path $PSScriptRoot 'created_secondaries_retry.json'
if (-not (Test-Path $metaPath)) { Write-Host "Missing $metaPath"; exit 1 }
$meta = Get-Content $metaPath -Raw | ConvertFrom-Json
$users = @($meta.u1, $meta.u2) | Where-Object { $_ -ne $null }
$rand = New-Object System.Random
$results = @()

function LoginGetToken($email,$pwd){
    try{
        $login = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/users/login' -Method Post -Body (@{ email=$email; password=$pwd } | ConvertTo-Json) -ContentType 'application/json' -ErrorAction Stop
        if ($login -and $login.PSObject.Properties.Name -contains 'access_token') { return $login.access_token }
        if ($login -and $login.PSObject.Properties.Name -contains 'token') { return $login.token }
        if ($login.data -and $login.data.access_token) { return $login.data.access_token }
    } catch {
        return $null
    }
}

foreach ($u in $users){
    $email = $u.email
    $pwd = $u.pwd
    $parent = $u.primary
    Write-Host "Processing $email parent $parent"
    $token = LoginGetToken $email $pwd
    if (-not $token) { Write-Host "Could not login $email" }

    $count = $rand.Next(1,4) # create 1..3 secondaries
    $created = @()
    for ($i=0; $i -lt $count; $i++){
        $timestamp = [int](Get-Date -UFormat %s)
        $accnum = "ACCSEC${timestamp}${i}"
        $initial = [Math]::Round($rand.NextDouble() * 50 + 1,2)
        $body = @{ account_number = $accnum; parent_account_number = $parent; initial_balance = $initial }
        $payload = $body | ConvertTo-Json

        # Try without auth
        try{
            $resp = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/accounts/open' -Method Post -Body $payload -ContentType 'application/json' -ErrorAction Stop
            Write-Host "Created without auth: $accnum"
            $created += @{ account=$accnum; initial=$initial; via='no-auth'; resp=$resp }
            continue
        } catch {
            # capture err
            $errNoAuth = ($_ | Out-String)
        }

        # Try with auth if we have token
        if ($token){
            try{
                $resp2 = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/accounts/open' -Method Post -Body $payload -ContentType 'application/json' -Headers @{ Authorization = 'Bearer ' + $token } -ErrorAction Stop
                Write-Host "Created with auth: $accnum"
                $created += @{ account=$accnum; initial=$initial; via='auth'; resp=$resp2 }
                continue
            } catch {
                $errAuth = ($_ | Out-String)
            }
        }

        # Try alternate endpoint variants
        $altEndpoints = @('http://127.0.0.1:8000/api/accounts/open','http://127.0.0.1:8000/accounts')
        $succeeded = $false
        foreach ($ep in $altEndpoints){
            try{
                $respX = Invoke-RestMethod -Uri $ep -Method Post -Body $payload -ContentType 'application/json' -Headers @{ Authorization = 'Bearer ' + $token } -ErrorAction Stop
                Write-Host "Created via $ep : $accnum"
                $created += @{ account=$accnum; initial=$initial; via=$ep; resp=$respX }
                $succeeded = $true; break
            } catch {
                # continue
            }
        }
        if (-not $succeeded){
            Write-Host "Failed to create secondary $accnum"
            $created += @{ account=$null; requested=$accnum; initial=$initial; via='failed'; err_noauth=$errNoAuth; err_auth=$errAuth }
        }
        Start-Sleep -Milliseconds 200
    }
    $results += @{ user=$email; primary=$parent; created=$created }
}

$results | ConvertTo-Json -Depth 8 | Out-File -FilePath $outPath -Encoding utf8
Write-Host "WROTE: $outPath"
Get-Content $outPath | Write-Host
