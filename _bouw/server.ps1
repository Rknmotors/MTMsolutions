# Kleine lokale webserver om de site te bekijken zoals GitHub Pages hem toont.
# Gebruik: powershell -NoProfile -ExecutionPolicy Bypass -File _bouw\server.ps1 [poort]
# en open daarna http://localhost:8137/ in je browser.
param([int]$poort = 8137)
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$site = Join-Path $root 'site'
if (-not (Test-Path (Join-Path $site 'index.html'))) { $site = $root }
$types = @{ '.html' = 'text/html; charset=utf-8'; '.css' = 'text/css'; '.js' = 'application/javascript';
  '.webp' = 'image/webp'; '.png' = 'image/png'; '.jpg' = 'image/jpeg'; '.xml' = 'application/xml'; '.txt' = 'text/plain' }
$l = New-Object Net.HttpListener
$l.Prefixes.Add("http://localhost:$poort/")
$l.Start()
Write-Host "Site op http://localhost:$poort/"
while ($l.IsListening) {
  $c = $l.GetContext()
  $pad = [Uri]::UnescapeDataString($c.Request.Url.AbsolutePath).TrimStart('/') -replace '/', '\'
  $bestand = Join-Path $site $pad
  if (Test-Path $bestand -PathType Container) { $bestand = Join-Path $bestand 'index.html' }
  $status = 200
  if (-not (Test-Path $bestand -PathType Leaf)) { $bestand = Join-Path $site '404.html'; $status = 404 }
  $bytes = [IO.File]::ReadAllBytes($bestand)
  $type = $types[[IO.Path]::GetExtension($bestand)]; if (-not $type) { $type = 'application/octet-stream' }
  $c.Response.StatusCode = $status
  $c.Response.ContentType = $type
  $c.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  $c.Response.Close()
}
