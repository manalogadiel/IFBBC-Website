Add-Type -AssemblyName System.Drawing
$b = New-Object System.Drawing.Bitmap 'public/logo.jpg'
Write-Output "Size: $($b.Width)x$($b.Height)"

# Find the bounding box of non-dark pixels or the actual circle/emblem
$minX = $b.Width
$maxX = 0
$minY = $b.Height
$maxY = 0

for ($y = 0; $y -lt $b.Height; $y += 4) {
    for ($x = 0; $x -lt $b.Width; $x += 4) {
        $p = $b.GetPixel($x, $y)
        $lum = $p.R * 0.299 + $p.G * 0.587 + $p.B * 0.114
        if ($lum -gt 80) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Output "Content Bounding Box: X=[$minX, $maxX], Y=[$minY, $maxY]"
Write-Output "Content Width: $($maxX - $minX), Content Height: $($maxY - $minY)"
$b.Dispose()
