$meta = Get-Content .\scripts\last_created_users.json -Raw | ConvertFrom-Json
$users = @($meta.u1, $meta.u2)
foreach ($u in $users){
    if (-not $u) { continue }
    $parent = $u.primary
    Write-Host "Fetching account details for $($u.email) parent $parent"
    try{
        $acc = Invoke-RestMethod -Uri "http://127.0.0.1:8000/accounts/$parent" -Method Get -ErrorAction Stop
        $acc | ConvertTo-Json -Depth 8 | Write-Host
    } catch {
        Write-Host "Failed to fetch $parent :"; ($_ | Out-String) | Write-Host
    }
    Write-Host "----"
}
