Add-Type -AssemblyName System.Drawing
$b = New-Object System.Drawing.Bitmap 'public/logo.jpg'

# Let's find the exact bounding box of the circular emblem ring:
# In the original image, let's scan from left to right along Y=497
for ($x = 0; $x -lt 512; $x++) {
    $p = $b.GetPixel($x, 497)
    $lum = $p.R * 0.299 + $p.G * 0.587 + $p.B * 0.114
    if ($lum -gt 90) {
        Write-Output "Left ring edge at Y=497: X=$x, Color=($($p.R),$($p.G),$($p.B))"
        break
    }
}

for ($x = $b.Width - 1; $x -gt 512; $x--) {
    $p = $b.GetPixel($x, 497)
    $lum = $p.R * 0.299 + $p.G * 0.587 + $p.B * 0.114
    if ($lum -gt 90) {
        Write-Output "Right ring edge at Y=497: X=$x, Color=($($p.R),$($p.G),$($p.B))"
        break
    }
}

for ($y = 0; $y -lt 497; $y++) {
    $p = $b.GetPixel(513, $y)
    $lum = $p.R * 0.299 + $p.G * 0.587 + $p.B * 0.114
    if ($lum -gt 90) {
        Write-Output "Top ring edge at X=513: Y=$y, Color=($($p.R),$($p.G),$($p.B))"
        break
    }
}

for ($y = $b.Height - 1; $y -gt 497; $y--) {
    $p = $b.GetPixel(513, $y)
    $lum = $p.R * 0.299 + $p.G * 0.587 + $p.B * 0.114
    if ($lum -gt 90) {
        Write-Output "Bottom ring edge at X=513: Y=$y, Color=($($p.R),$($p.G),$($p.B))"
        break
    }
}

$b.Dispose()
