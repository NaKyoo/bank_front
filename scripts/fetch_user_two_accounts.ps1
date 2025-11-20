$u='user.two.1763636675@example.com'; $p='Test12345!';
$login = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/users/login' -Method Post -Body (@{ email=$u; password=$p } | ConvertTo-Json) -ContentType 'application/json'
$token = $null
if ($login -and $login.PSObject.Properties.Name -contains 'access_token') { $token = $login.access_token }
elseif ($login -and $login.PSObject.Properties.Name -contains 'token') { $token = $login.token }
elseif ($login.data -and $login.data.access_token) { $token = $login.data.access_token }
if (-not $token) { Write-Host 'no token'; exit 1 }
$accs = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/users/me/accounts' -Method Get -Headers @{ Authorization = 'Bearer ' + $token }
$accs | ConvertTo-Json -Depth 5 | Write-Host
