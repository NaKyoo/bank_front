# Transfer swap test: call transfer with swapped fields to simulate correct debit/credit
$u = 'user.one.1763636674@example.com'; $p = 'Test12345!'
$login = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/users/login' -Method Post -Body (@{ email=$u; password=$p } | ConvertTo-Json) -ContentType 'application/json'
$token = $null
if ($login -and $login.PSObject.Properties.Name -contains 'access_token') { $token = $login.access_token }
elseif ($login -and $login.PSObject.Properties.Name -contains 'token') { $token = $login.token }
elseif ($login.data -and $login.data.access_token) { $token = $login.data.access_token }
if (-not $token) { Write-Host 'no token'; exit 1 }
$A='ACCA4262C153894'
$B='ACC58B888FEB440'
Write-Host "Balances before:"; (Invoke-RestMethod -Uri 'http://127.0.0.1:8000/users/me/accounts' -Method Get -Headers @{ Authorization = 'Bearer ' + $token }) | ConvertTo-Json | Write-Host
$payload = @{ from_account = $B; to_account = $A; amount = 1 } | ConvertTo-Json
$resp = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/transfer' -Method Post -Body $payload -Headers @{ Authorization = 'Bearer ' + $token } -ContentType 'application/json'
Write-Host 'Transfer resp:'; $resp | ConvertTo-Json | Write-Host
Start-Sleep -Seconds 6
Write-Host 'Balances after:'; (Invoke-RestMethod -Uri 'http://127.0.0.1:8000/users/me/accounts' -Method Get -Headers @{ Authorization = 'Bearer ' + $token }) | ConvertTo-Json | Write-Host
