Add-Type -AssemblyName System.Drawing
$b = New-Object System.Drawing.Bitmap 'public/logo.jpg'

for ($y = 200; $y -lt 350; $y++) {
    for ($x = 480; $x -lt 540; $x++) {
        $p = $b.GetPixel($x, $y)
        if ($p.R -gt 150 -and $p.G -gt 150 -and $p.B -gt 150) {
            Write-Output "Cross/Text peak at ($x, $y): ($($p.R),$($p.G),$($p.B))"
            break
        }
    }
}
$b.Dispose()
