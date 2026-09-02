Add-Type -AssemblyName System.Drawing
$b = New-Object System.Drawing.Bitmap 'public/logo.jpg'

# Let's inspect along vertical line X=507 (center) between Y=180 and Y=820:
for ($y = 180; $y -lt 400; $y++) {
    $p = $b.GetPixel(507, $y)
    # The outer ring has light bluish/white or gold text
    if ($p.R -gt 100 -and $p.G -gt 100 -and $p.B -gt 100) {
        Write-Output "Circle Top border at X=507: Y=$y, Color=($($p.R),$($p.G),$($p.B))"
        break
    }
}

for ($y = 820; $y -gt 600; $y--) {
    $p = $b.GetPixel(507, $y)
    if ($p.R -gt 100 -and $p.G -gt 100 -and $p.B -gt 100) {
        Write-Output "Circle Bottom border at X=507: Y=$y, Color=($($p.R),$($p.G),$($p.B))"
        break
    }
}

$b.Dispose()
