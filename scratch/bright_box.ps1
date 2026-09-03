Add-Type -AssemblyName System.Drawing
$b = New-Object System.Drawing.Bitmap 'public/logo-caya.png'
Write-Output "Image dimensions: $($b.Width) x $($b.Height)"

# Let's check brightness in columns and rows
# Find where the white / high contrast elements are (luminance > 120)
$minX = 1000; $maxX = 0; $minY = 1000; $maxY = 0

for ($y = 0; $y -lt $b.Height; $y++) {
    for ($x = 0; $x -lt $b.Width; $x++) {
        $p = $b.GetPixel($x, $y)
        $lum = $p.R * 0.299 + $p.G * 0.587 + $p.B * 0.114
        if ($p.A -gt 10) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Output "Bright content bounding box:"
Write-Output "X: $minX to $maxX (width: $($maxX - $minX))"
Write-Output "Y: $minY to $maxY (height: $($maxY - $minY))"
Write-Output "Center: X=$([int](($minX+$maxX)/2)), Y=$([int](($minY+$maxY)/2))"

$b.Dispose()
