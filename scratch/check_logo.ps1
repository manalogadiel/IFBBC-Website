Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap 'public/logo.jpg'
Write-Output "Image size: $($bmp.Width) x $($bmp.Height)"

# Find bounds of white pixels (emblem)
$minX = $bmp.Width; $maxX = 0
$minY = $bmp.Height; $maxY = 0

for ($y = 0; $y -lt $bmp.Height; $y += 2) {
    for ($x = 0; $x -lt $bmp.Width; $x += 2) {
        $pixel = $bmp.GetPixel($x, $y)
        # Check for bright/white pixel of emblem
        if ($pixel.R -gt 220 -and $pixel.G -gt 220 -and $pixel.B -gt 220) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Output "Emblem bounds: X: $minX to $maxX, Y: $minY to $maxY"
Write-Output "Width: $($maxX - $minX), Height: $($maxY - $minY)"
$bmp.Dispose()
