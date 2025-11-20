<#
Full end-to-end test script (PowerShell)

Creates 2 users, gives each a primary account and two secondary accounts,
performs transfers between accounts, closes an account and re-opens a new one,
then prints a final summary of accounts and transactions.

Usage: run from project root with PowerShell:
  pwsh ./scripts/full_test_users.ps1

Ensure backend is running at $baseUrl (default http://127.0.0.1:8000)
#>

param(
  [string]$baseUrl = 'http://127.0.0.1:8000'
)

$ErrorActionPreference = 'Stop'

function Invoke-ApiJson($method, $url, $body = $null, $token = $null) {
  $headers = @{ 'Content-Type' = 'application/json' }
  if ($token) { $headers['Authorization'] = "Bearer $token" }
  if ($body -ne $null) { $json = $body | ConvertTo-Json -Depth 6 } else { $json = $null }
  # Verbose request logging (mask auth header)
  $displayHeaders = @{}
  foreach ($k in $headers.Keys) {
    if ($k -ieq 'Authorization') { $displayHeaders[$k] = 'Bearer ****' } else { $displayHeaders[$k] = $headers[$k] }
  }
  Write-Host "CALL -> $method $url" -ForegroundColor Cyan
  Write-Host "Headers: $($displayHeaders | ConvertTo-Json -Depth 4)"
  if ($json) { Write-Host "Body: $json" }
  try {
    if ($json) {
      return Invoke-RestMethod -Method $method -Uri $url -Headers $headers -Body $json -ContentType 'application/json'
    } else {
      return Invoke-RestMethod -Method $method -Uri $url -Headers $headers
    }
  } catch {
    Write-Host "API error calling $method $url : $_" -ForegroundColor Red
    # try to dump HTTP status and response body if available
    try {
      $webResp = $_.Exception.Response
      if ($webResp -ne $null) {
        $http = $webResp -as [System.Net.HttpWebResponse]
        if ($http -ne $null) { Write-Host "HTTP Status: $($http.StatusCode)" -ForegroundColor Red }
        $sr = New-Object System.IO.StreamReader($webResp.GetResponseStream())
        $respBody = $sr.ReadToEnd()
        if ($respBody) { Write-Host "Response body: $respBody" -ForegroundColor Red }
      }
    } catch {
      Write-Host "(failed to read response body)" -ForegroundColor Yellow
    }
    return $null
  }
}

function Register-User($email, $password) {
  Write-Host "Registering $email"
  $body = @{ email = $email; password = $password }
  return Invoke-ApiJson -method POST -url "$baseUrl/users/register" -body $body
}

function Login-User($email, $password) {
  Write-Host "Logging in $email"
  $body = @{ email = $email; password = $password }
  $res = Invoke-ApiJson -method POST -url "$baseUrl/users/login" -body $body
  # try common token keys (PowerShell 5 compatible)
  $token = $null
  if ($res.token) { $token = $res.token }
  elseif ($res.access_token) { $token = $res.access_token }
  elseif ($res.accessToken) { $token = $res.accessToken }
  if (-not $token) { Write-Host "Warning: login did not return a token object; returning raw response" -ForegroundColor Yellow }
  return @{ raw = $res; token = $token }
}

function Get-MyAccounts($token) {
  return Invoke-ApiJson -method GET -url "$baseUrl/users/me/accounts" -token $token
}

function Open-Account($token, $accountNumber, $parent = $null, $initial = 0) {
  $body = @{ account_number = $accountNumber; parent_account_number = $parent; initial_balance = $initial }
  return Invoke-ApiJson -method POST -url "$baseUrl/accounts/open" -body $body -token $token
}

function Close-Account($token, $accountNumber) {
  return Invoke-ApiJson -method POST -url "$baseUrl/accounts/$accountNumber/close" -token $token
}

function Transfer($token, $from, $to, $amount) {
  Write-Host "Transfer $amount from $from -> $to"
  $body = @{ from_account = $from; to_account = $to; amount = $amount }
  return Invoke-ApiJson -method POST -url "$baseUrl/transfer" -body $body -token $token
}

function Get-Transactions($token, $accountNumber) {
  return Invoke-ApiJson -method GET -url "$baseUrl/accounts/$accountNumber/transactions" -token $token
}

function Add-Beneficiary($token, $ownerAccount, $beneficiaryAccount, $name) {
  Write-Host "Adding beneficiary $beneficiaryAccount (name: $name) to $ownerAccount"
  $body = @{ beneficiary_account_number = $beneficiaryAccount; beneficiary_name = $name }
  return Invoke-ApiJson -method POST -url "$baseUrl/accounts/$ownerAccount/beneficiaries" -body $body -token $token
}

function Get-Beneficiaries($token, $ownerAccount) {
  return Invoke-ApiJson -method GET -url "$baseUrl/accounts/$ownerAccount/beneficiaries" -token $token
}

function Poll-TransactionStatus($userAccount, $transactionId, $maxSeconds = 30, $token = $null) {
  $elapsed = 0
  while ($elapsed -lt $maxSeconds) {
    try {
      $res = Invoke-ApiJson -method GET -url "$baseUrl/transactions/$userAccount/$transactionId" -token $token
      if ($res.status -and ($res.status -ne 'pending')) {
        return $res
      }
    } catch {
      Write-Host "Error polling transaction $transactionId : $_" -ForegroundColor Yellow
    }
    Start-Sleep -Seconds 2
    $elapsed += 2
  }
  Write-Host "Poll timeout for transaction $transactionId after $maxSeconds seconds" -ForegroundColor Yellow
  return $null
}

function EchoAccounts($accounts) {
  foreach ($a in $accounts) {
    $num = $a.account_number
    if ($null -ne $a.balance) { $bal = $a.balance }
    elseif ($null -ne $a.current_balance) { $bal = $a.current_balance }
    else { $bal = $a.amount }
    Write-Host " - $num : $bal €"
  }
}

### Test scenario data
$u1 = @{ email = 'test.user1+pw@test.com'; password = 'Test1234!' }
$u2 = @{ email = 'test.user2+pw@test.com'; password = 'Test1234!' }

Write-Host "Starting full test against $baseUrl" -ForegroundColor Cyan

# 1) Register users
# Try register; if it fails (user exists), continue and attempt login
try {
  $r1 = Register-User $u1.email $u1.password
} catch {
  Write-Host "Register user1 failed (maybe already exists): $_" -ForegroundColor Yellow
  $r1 = $null
}
try {
  $r2 = Register-User $u2.email $u2.password
} catch {
  Write-Host "Register user2 failed (maybe already exists): $_" -ForegroundColor Yellow
  $r2 = $null
}

# 2) Login and get tokens
$l1 = Login-User $u1.email $u1.password
$l2 = Login-User $u2.email $u2.password
$t1 = $l1.token
$t2 = $l2.token

if (-not $t1 -or -not $t2) { Write-Host "Tokens not found; ensure backend returns token on login" -ForegroundColor Yellow }

# 3) Get primary accounts (parent_account_number == null)
$a1 = Get-MyAccounts $t1
$a2 = Get-MyAccounts $t2

$primary1 = ($a1 | Where-Object { $_.parent_account_number -eq $null })[0].account_number
$primary2 = ($a2 | Where-Object { $_.parent_account_number -eq $null })[0].account_number

Write-Host "User1 primary: $primary1"
Write-Host "User2 primary: $primary2"

# 4) Create two secondary accounts for each user
$s1a = "${primary1}-S1"
$s1b = "${primary1}-S2"
$s2a = "${primary2}-S1"
$s2b = "${primary2}-S2"

Open-Account $t1 $s1a $primary1 1000
Open-Account $t1 $s1b $primary1 500
Open-Account $t2 $s2a $primary2 800
Open-Account $t2 $s2b $primary2 300

# 4.5) Add a beneficiary for user1 pointing to user2's primary (tests beneficiary_name)
try {
  $bRes = Add-Beneficiary $t1 $primary1 $primary2 "Friend-Primary"
  Write-Host "Add beneficiary response: $($bRes | ConvertTo-Json -Depth 3)"
} catch {
  Write-Host "Add beneficiary failed: $_" -ForegroundColor Yellow
}

# List beneficiaries
try {
  $bList = Get-Beneficiaries $t1 $primary1
  Write-Host "Beneficiaries for ${primary1}: $($bList | ConvertTo-Json -Depth 3)"
} catch {
  Write-Host "Could not list beneficiaries: $_" -ForegroundColor Yellow
}

Write-Host "Secondary accounts opened. Refreshing accounts..."
$a1 = Get-MyAccounts $t1
$a2 = Get-MyAccounts $t2

Write-Host "User1 accounts:"; EchoAccounts $a1
Write-Host "User2 accounts:"; EchoAccounts $a2

# 5) Perform transfers (capture tx id and poll for completion)
$transfers = @()

$res = Transfer $t1 $primary1 $s1a 150
if ($res) { $transfers += @{ account=$primary1; res=$res } }
Start-Sleep -Seconds 1

$res = Transfer $t1 $s1a $primary2 200
if ($res) { $transfers += @{ account=$s1a; res=$res } }
Start-Sleep -Seconds 1

$res = Transfer $t2 $primary2 $s2b 50
if ($res) { $transfers += @{ account=$primary2; res=$res } }
Start-Sleep -Seconds 1

$res = Transfer $t2 $s2b $primary1 75
if ($res) { $transfers += @{ account=$s2b; res=$res } }

# Poll each transfer for completion (up to 30s)
foreach ($t in $transfers) {
  $r = $t.res
  $txId = $null
  if ($r.id) { $txId = $r.id }
  elseif ($r.transaction_id) { $txId = $r.transaction_id }
  elseif ($r.transactionId) { $txId = $r.transactionId }
  if ($txId) {
    Write-Host "Polling tx $txId for account $($t.account)"
    $final = Poll-TransactionStatus $t.account $txId 30 $t1
    if ($final) { Write-Host "Tx $txId status: $($final.status)" } else { Write-Host "Tx $txId did not complete in time" -ForegroundColor Yellow }
  } else {
    Write-Host "Transfer response did not include a transaction id: $($r | ConvertTo-Json -Depth 3)" -ForegroundColor Yellow
  }
}

Write-Host "Transfers done. Fetching transactions for involved accounts..."
$tx = Get-Transactions $t1 $primary1
Write-Host ("Transactions for {0}:" -f $primary1)
$tx | Format-Table -AutoSize

# 6) Close one secondary account (user1 s1b)
Close-Account $t1 $s1b
Write-Host "Closed $s1b"

# 7) Open a new secondary for user1
$newAcc = "${primary1}-NEW"
Open-Account $t1 $newAcc $primary1 250
Write-Host "Opened new account $newAcc"

# 8) Final accounts summary
$a1Final = Get-MyAccounts $t1
$a2Final = Get-MyAccounts $t2

Write-Host "Final User1 accounts:"; EchoAccounts $a1Final
Write-Host "Final User2 accounts:"; EchoAccounts $a2Final

Write-Host "Full test completed." -ForegroundColor Green
