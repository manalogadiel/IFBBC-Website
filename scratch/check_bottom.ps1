Add-Type -AssemblyName System.Drawing
$b = New-Object System.Drawing.Bitmap 'public/logo.jpg'

for ($y = 850; $y -gt 700; $y--) {
    for ($x = 220; $x -lt 800; $x++) {
        $p = $b.GetPixel($x, $y)
        if ($p.R -gt 150 -and $p.G -gt 150 -and $p.B -gt 150) {
            Write-Output "Lowest bright point at ($x, $y): ($($p.R),$($p.G),$($p.B))"
            break
        }
    }
    if ($p.R -gt 150 -and $p.G -gt 150 -and $p.B -gt 150) { break }
}
$b.Dispose()
