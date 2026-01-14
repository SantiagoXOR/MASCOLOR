# Script para abrir la presentación unificada
$presentacion = Join-Path $PSScriptRoot "presentacion-unificada.html"

Write-Host "Abriendo presentación..." -ForegroundColor Green
Write-Host "Archivo: $presentacion" -ForegroundColor Yellow

# Intentar abrir con el navegador predeterminado
Start-Process $presentacion

Write-Host ""
Write-Host "Si prefieres usar un servidor HTTP local, ejecuta:" -ForegroundColor Cyan
Write-Host "  python -m http.server 8000" -ForegroundColor White
Write-Host "Luego abre: http://localhost:8000/presentacion-unificada.html" -ForegroundColor White
