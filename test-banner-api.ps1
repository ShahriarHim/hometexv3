$urls = @(
    'https://www.hometexbd.ltd/api/hero-banners',
    'http://localhost:8000/api/hero-banners'
)

foreach($url in $urls) {
    Write-Host "`n=== Testing $url ===" -ForegroundColor Cyan
    try {
        $response = Invoke-WebRequest -Uri $url -TimeoutSec 5 -ErrorAction Stop
        Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
        Write-Host "Content:" -ForegroundColor Yellow
        $content = $response.Content | ConvertFrom-Json
        $content | ConvertTo-Json -Depth 5
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "Failed ($statusCode)" -ForegroundColor Red
        if ($_.Exception.Message) {
            Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
}
