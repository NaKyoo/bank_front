$parent='ACC58B888FEB440'
$base='ACCSEC_U2_'
$rand = New-Object System.Random
$results = @()
for ($i=1; $i -le 3; $i++){
    $acc = $base + $i
    $initial = [Math]::Round($rand.NextDouble() * 50 + 1,2)
    $body = @{ account_number = $acc; parent_account_number = $parent; initial_balance = $initial } | ConvertTo-Json
    try{
        $r = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/accounts/open' -Method Post -Body $body -ContentType 'application/json' -ErrorAction Stop
        $results += [pscustomobject]@{ account=$acc; ok=$true; resp=$r }
        Write-Host "Created $acc"
    } catch {
        $results += [pscustomobject]@{ account=$acc; ok=$false; err=($_ | Out-String) }
        Write-Host "Failed $acc"
    }
    Start-Sleep -Milliseconds 200
}
$results | ConvertTo-Json -Depth 6 | Out-File .\scripts\created_secondaries_u2.json -Encoding utf8
Write-Host 'WROTE .\scripts\created_secondaries_u2.json'
Get-Content .\scripts\created_secondaries_u2.json | Write-Host
