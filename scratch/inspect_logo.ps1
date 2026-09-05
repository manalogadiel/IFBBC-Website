Add-Type -AssemblyName System.Drawing

$b = [System.Drawing.Bitmap]::FromFile('C:\Users\gadie\.gemini\antigravity-ide\brain\5ceeecf9-1d8d-4e17-8a7b-5f9c0ca40d75\.tempmediaStorage\media_1788546430924.png')
Write-Output "Pic 2 dimensions: $($b.Width)x$($b.Height)"

# Check top, bottom, left, right edges average color
$rSum = 0; $gSum = 0; $bSum = 0; $count = 0
for ($x = 0; $x -lt $b.Width; $x += 4) {
    $p1 = $b.GetPixel($x, 0)
    $p2 = $b.GetPixel($x, $b.Height - 1)
    $rSum += $p1.R + $p2.R
    $gSum += $p1.G + $p2.G
    $bSum += $p1.B + $p2.B
    $count += 2
}
for ($y = 0; $y -lt $b.Height; $y += 4) {
    $p1 = $b.GetPixel(0, $y)
    $p2 = $b.GetPixel($b.Width - 1, $y)
    $rSum += $p1.R + $p2.R
    $gSum += $p1.G + $p2.G
    $bSum += $p1.B + $p2.B
    $count += 2
}
$avgR = [int]($rSum / $count)
$avgG = [int]($gSum / $count)
$avgB = [int]($bSum / $count)
Write-Output "Average perimeter color: R=$avgR, G=$avgG, B=$avgB (Hex: #$($avgR.ToString('X2'))$($avgG.ToString('X2'))$($avgB.ToString('X2')))"
$b.Dispose()











