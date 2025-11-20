$email='user.two.1763636675@example.com'
$pwd='Test12345!'
# Login
try{
    $login = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/users/login' -Method Post -Body (@{ email=$email; password=$pwd } | ConvertTo-Json) -ContentType 'application/json' -ErrorAction Stop
} catch { Write-Host 'Login failed'; exit 1 }
$token = $null
if ($login -and $login.PSObject.Properties.Name -contains 'access_token') { $token = $login.access_token }
elseif ($login -and $login.PSObject.Properties.Name -contains 'token') { $token = $login.token }
elseif ($login.data -and $login.data.access_token) { $token = $login.data.access_token }
if (-not $token) { Write-Host 'No token'; exit 1 }
$parent='ACC58B888FEB440'
$results=@()
for ($i=1; $i -le 2; $i++){
    $ts = (Get-Date).ToString('yyyyMMddHHmmssfff')
    $acc = "ACCSEC_U2_AUTH_${ts}_$i"
    $initial = [Math]::Round((Get-Random -Minimum 1 -Maximum 50) + (Get-Random)/100,2)
    $body = @{ account_number = $acc; parent_account_number = $parent; initial_balance = $initial } | ConvertTo-Json
    try{
        $r = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/accounts/open' -Method Post -Body $body -ContentType 'application/json' -Headers @{ Authorization = 'Bearer ' + $token } -ErrorAction Stop
        $results += [pscustomobject]@{ account=$acc; ok=$true; resp=$r }
        Write-Host "Created $acc"
    } catch {
        $results += [pscustomobject]@{ account=$acc; ok=$false; err=($_ | Out-String) }
        Write-Host "Failed $acc"
    }
    Start-Sleep -Milliseconds 200
}
$results | ConvertTo-Json -Depth 6 | Out-File .\scripts\created_secondaries_u2_auth2.json -Encoding utf8
Write-Host 'WROTE scripts\created_secondaries_u2_auth2.json'
Get-Content .\scripts\created_secondaries_u2_auth2.json | Write-Host
