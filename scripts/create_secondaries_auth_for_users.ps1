# Create secondary accounts for last created users using Authorization header
$meta = Get-Content .\scripts\last_created_users.json -Raw | ConvertFrom-Json
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
    Write-Host "Login $email"
    $token = LoginGetToken $email $pwd
    if (-not $token) { Write-Host "Could not get token for $email"; continue }
    $created = @()
    for ($i=1; $i -le 2; $i++){
        $acc = "ACCSEC_${($email -replace '[^0-9]','')}_$i"
        $initial = [Math]::Round($rand.NextDouble()*20 + 1,2)
        $body = @{ account_number = $acc; parent_account_number = $parent; initial_balance = $initial } | ConvertTo-Json
        try{
            $r = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/accounts/open' -Method Post -Body $body -ContentType 'application/json' -Headers @{ Authorization = 'Bearer ' + $token } -ErrorAction Stop
            Write-Host "Created (auth) $acc for $email"
            $created += @{ account=$acc; ok=$true; resp=$r }
        } catch {
            Write-Host "Failed create (auth) $acc for $email"; $created += @{ account=$acc; ok=$false; err=($_ | Out-String) }
        }
        Start-Sleep -Milliseconds 200
    }
    $results += @{ user=$email; primary=$parent; created=$created }
}
$results | ConvertTo-Json -Depth 8 | Out-File .\scripts\created_secondaries_auth.json -Encoding utf8
Write-Host 'WROTE scripts\created_secondaries_auth.json'
Get-Content .\scripts\created_secondaries_auth.json | Write-Host
