# Creates 2 users, opens secondary accounts (tries several payload formats), funds them if needed, prints results.
# Usage: powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\create_users_with_secondaries.ps1

function New-Email($prefix){ $ts = (Get-Date -UFormat %s) -replace ',','.'; $ts = ($ts -split '\.')[0]; return "$prefix.$ts@example.com" }

function RegisterUser($namePrefix){
    $email = New-Email $namePrefix
    $password = 'Test12345!'
    $body = @{ name = $namePrefix; email = $email; password = $password } | ConvertTo-Json
    try {
        $reg = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/users/register' -Method Post -Body $body -ContentType 'application/json' -ErrorAction Stop
        return @{ email=$email; pwd=$password; primary=$reg.primary_account_number }
    } catch {
        Write-Host "REGISTER_FAILED $email"; $_ | Out-String | Write-Host; return $null
    }
}

function LoginGetToken($email,$pwd){
    try {
        $login = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/users/login' -Method Post -Body (@{ email=$email; password=$pwd } | ConvertTo-Json) -ContentType 'application/json' -ErrorAction Stop
        $token = $null
        if ($login -and $login.PSObject.Properties.Name -contains 'token') { $token = $login.token }
        elseif ($login -and $login.PSObject.Properties.Name -contains 'access_token') { $token = $login.access_token }
        elseif ($login -and $login.data -and $login.data.token) { $token = $login.data.token }
        return $token
    } catch { Write-Host "LOGIN_FAILED $email"; $_ | Out-String | Write-Host; return $null }
}

function TryOpenAccount($token,$parentAcc,$accType,$initialDeposit){
    $endpoints = @("http://127.0.0.1:8000/accounts/open","http://127.0.0.1:8000/api/accounts/open","http://127.0.0.1:8000/accounts")
    $bodyVariants = @(
        @{ parent_account_number = $parentAcc; account_type = $accType; initial_deposit = $initialDeposit },
        @{ owner_account_number = $parentAcc; account_type = $accType; initial_deposit = $initialDeposit },
        @{ parent = $parentAcc; type = $accType; initial_deposit = $initialDeposit }
    )

    foreach ($ep in $endpoints){
        foreach ($b in $bodyVariants){
            try{
                $payload = $b | ConvertTo-Json
                $resp = Invoke-RestMethod -Uri $ep -Method Post -Body $payload -Headers @{ Authorization = 'Bearer ' + $token } -ContentType 'application/json' -ErrorAction Stop
                return @{ ok=$true; endpoint=$ep; resp=$resp }
            } catch {
                # continue trying
            }
        }
    }
    return @{ ok=$false }
}

function DoTransfer($from,$to,$amount,$token){
    $payload = @{ from_account = $from; to_account = $to; amount = $amount } | ConvertTo-Json
    try { $r = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/transfer' -Method Post -Body $payload -Headers @{ Authorization = 'Bearer ' + $token } -ContentType 'application/json' -ErrorAction Stop; return @{ ok=$true; res=$r } } catch { return @{ ok=$false; raw = $_ | Out-String } }
}

# Create two users
$u1 = RegisterUser 'user.one'
Start-Sleep -Milliseconds 200
$u2 = RegisterUser 'user.two'
if (-not $u1 -or -not $u2){ Write-Host 'User registration failed'; exit 1 }

# Login
$token1 = LoginGetToken $u1.email $u1.pwd
$token2 = LoginGetToken $u2.email $u2.pwd
if (-not $token1 -or -not $token2){ Write-Host 'Login failed'; exit 1 }

# Read primary accounts from registration result (already provided) and verify via /users/me/accounts
function GetPrimary($token){ try { $acc = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/users/me/accounts' -Method Get -Headers @{ Authorization = 'Bearer ' + $token } -ErrorAction Stop; if ($acc -is [System.Array]){ return $acc[0] } else { return $acc } } catch { return $null } }
$p1 = GetPrimary $token1
$p2 = GetPrimary $token2
if ($p1 -and $p1.account_number) { $u1.primary = $p1.account_number }
if ($p2 -and $p2.account_number) { $u2.primary = $p2.account_number }

Write-Host "User1: $($u1.email) primary: $($u1.primary)"
Write-Host "User2: $($u2.email) primary: $($u2.primary)"

# For each user, create 1-3 secondary accounts with random balances
$rand = New-Object System.Random
$results = @()
foreach ($u in @(@{info=$u1; token=$token1}, @{info=$u2; token=$token2})){
    $count = $rand.Next(1,4) # 1..3
    $created = @()
    for ($i=0;$i -lt $count; $i++){
        $amt = [Math]::Round($rand.NextDouble() * 80 + 1,2) # 1..81
        $amtInt = [int][Math]::Floor($amt)
        $try = TryOpenAccount $u.token $u.info.primary 'savings' $amtInt
        if ($try.ok){
            # try.res may contain account_number or similar
            $acctNum = $null
            if ($try.res.PSObject.Properties.Name -contains 'account_number') { $acctNum = $try.res.account_number }
            elseif ($try.res.PSObject.Properties.Name -contains 'primary_account_number') { $acctNum = $try.res.primary_account_number }
            elseif ($try.res.account) { $acctNum = $try.res.account.account_number }
            $created += @{ account=$acctNum; requested_initial=$amtInt; via=$try.endpoint }
            # if account created but no balance, attempt transfer from primary to set balance
            if ($acctNum){
                # wait briefly
                Start-Sleep -Milliseconds 200
                # attempt transfer to fund secondary (if needed)
                $fund = DoTransfer $u.info.primary $acctNum $amtInt $u.token
                if ($fund.ok){ $created[-1].funded = $true } else { $created[-1].funded = $false; $created[-1].fund_err = $fund.raw }
            }
        } else {
            $created += @{ account=$null; requested_initial=$amtInt; via='failed' }
        }
        Start-Sleep -Milliseconds 150
    }
    $results += @{ user = $u.info.email; primary = $u.info.primary; created = $created }
}

# Print results and save to file
$results | ConvertTo-Json -Depth 6 | Out-File -FilePath .\scripts\created_users_with_secondaries.json -Encoding utf8
Write-Host "WROTE: scripts\\created_users_with_secondaries.json"
Write-Host (Get-Content .\scripts\created_users_with_secondaries.json)

# Also print readable summary
foreach ($r in $results){
    Write-Host "\nUser: $($r.user) primary: $($r.primary)"
    foreach ($c in $r.created){ Write-Host " - secondary: $($c.account) initial_requested: $($c.requested_initial) via: $($c.via) funded: $($c.funded)" }
}

# Save last meta for reuse
@{ u1=$u1; u2=$u2; results=$results } | ConvertTo-Json -Depth 6 | Out-File .\scripts\last_created_users.json -Encoding utf8
Write-Host 'Done.'
