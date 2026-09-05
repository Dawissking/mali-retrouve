$proc = Start-Process node -ArgumentList "dist/server.js" -RedirectStandardOutput "server.log" -RedirectStandardError "server-err.log" -PassThru
Write-Host "Server PID: $($proc.Id)"
Start-Sleep -Seconds 3
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -Method GET -UseBasicParsing -TimeoutSec 5
    Write-Host "Health check status: $($response.StatusCode)"
    Write-Host "Health check body: $($response.Content)"
} catch {
    Write-Host "Health check failed: $_"
}
Stop-Process -Id $proc.Id -Force
Write-Host "Server stopped."
