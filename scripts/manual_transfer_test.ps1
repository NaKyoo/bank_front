# manual_transfer_test.ps1
# Login user.one, transfer 5 to user.two, wait and print accounts
$u = 'user.one.1763636674@example.com'
$p = 'Test12345!'
try {
    $login = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/users/login' -Method Post -Body (@{ email=$u; password=$p } | ConvertTo-Json) -ContentType 'application/json' -ErrorAction Stop
} catch {
    Write-Host "Login failed:"; $_ | Out-String | Write-Host; exit 1
}
$token = $null
if ($login -and $login.PSObject.Properties.Name -contains 'access_token') { $token = $login.access_token }
elseif ($login -and $login.PSObject.Properties.Name -contains 'token') { $token = $login.token }
elseif ($login.data -and $login.data.access_token) { $token = $login.data.access_token }
if (-not $token) { Write-Host 'No token found'; exit 1 }
Write-Host "Token length: $($token.Length)"
$from = 'ACCA4262C153894'
$to = 'ACC58B888FEB440'
$payload = @{ from_account = $from; to_account = $to; amount = 5 } | ConvertTo-Json
try {
    $resp = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/transfer' -Method Post -Body $payload -Headers @{ Authorization = 'Bearer ' + $token } -ContentType 'application/json' -ErrorAction Stop
    Write-Host 'TRANSFER RESPONSE:'
    $resp | ConvertTo-Json -Depth 5 | Write-Host
} catch {
    Write-Host 'Transfer failed:'; $_ | Out-String | Write-Host; exit 1
}
Write-Host 'Waiting 8 seconds for worker...'
Start-Sleep -Seconds 8
try {
    $accs = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/users/me/accounts' -Method Get -Headers @{ Authorization = 'Bearer ' + $token } -ErrorAction Stop
    Write-Host 'ACCOUNTS AFTER:'
    $accs | ConvertTo-Json -Depth 5 | Write-Host
} catch {
    Write-Host 'Failed to fetch accounts:'; $_ | Out-String | Write-Host
}
