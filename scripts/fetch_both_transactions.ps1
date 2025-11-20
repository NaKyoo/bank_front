function GetToken($email,$pwd){
    $login = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/users/login' -Method Post -Body (@{ email=$email; password=$pwd } | ConvertTo-Json) -ContentType 'application/json'
    $token = $null
    if ($login -and $login.PSObject.Properties.Name -contains 'access_token') { $token = $login.access_token }
    elseif ($login -and $login.PSObject.Properties.Name -contains 'token') { $token = $login.token }
    elseif ($login.data -and $login.data.access_token) { $token = $login.data.access_token }
    return $token
}
$u1='user.one.1763636674@example.com'; $p='Test12345!'
$t1 = GetToken $u1 $p
Write-Host "Transactions for ${u1}:"; (Invoke-RestMethod -Uri 'http://127.0.0.1:8000/users/me/transactions' -Method Get -Headers @{ Authorization = 'Bearer ' + $t1 } ) | ConvertTo-Json -Depth 10 | Write-Host
$u2='user.two.1763636675@example.com'
$t2 = GetToken $u2 $p
Write-Host "Transactions for ${u2}:"; (Invoke-RestMethod -Uri 'http://127.0.0.1:8000/users/me/transactions' -Method Get -Headers @{ Authorization = 'Bearer ' + $t2 } ) | ConvertTo-Json -Depth 10 | Write-Host
