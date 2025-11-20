# Read last created users and fetch accounts for each (login + GET /users/me/accounts)
$metaPath = Join-Path $PSScriptRoot 'last_created_users.json'
$outPath = Join-Path $PSScriptRoot 'last_users_accounts.json'
if (-not (Test-Path $metaPath)) { Write-Host "Missing $metaPath"; exit 1 }
$meta = Get-Content $metaPath -Raw | ConvertFrom-Json
$results = @()
function Get-TokenAndAccounts($email,$pwd){
    try{
        $login = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/users/login' -Method Post -Body (@{ email=$email; password=$pwd } | ConvertTo-Json) -ContentType 'application/json' -ErrorAction Stop
        $token = $null
        if ($login -and $login.PSObject.Properties.Name -contains 'access_token') { $token = $login.access_token }
        elseif ($login -and $login.PSObject.Properties.Name -contains 'token') { $token = $login.token }
        elseif ($login.data -and $login.data.access_token) { $token = $login.data.access_token }
        if (-not $token) { return @{ ok=$false; error='no_token' } }
        $accounts = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/users/me/accounts' -Method Get -Headers @{ Authorization = 'Bearer ' + $token } -ErrorAction Stop
        return @{ ok=$true; token=$token; accounts=$accounts }
    } catch {
        return @{ ok=$false; error = ($_ | Out-String) }
    }
}

$users = @($meta.u1, $meta.u2) | Where-Object { $_ -ne $null }
foreach ($u in $users){
    $email = $u.email
    $pwd = $u.pwd
    Write-Host "Fetching for $email"
    $r = Get-TokenAndAccounts $email $pwd
    $results += @{ email=$email; primary=$u.primary; ok=$r.ok; error=($r.error -as [string]); accounts=$r.accounts }
}
$results | ConvertTo-Json -Depth 6 | Out-File -FilePath $outPath -Encoding utf8
Write-Host "WROTE: $outPath"
Get-Content $outPath | Write-Host

Write-Host 'Done.'
