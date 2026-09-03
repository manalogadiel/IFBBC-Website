Add-Type -AssemblyName System.Drawing

$logos = @('public/adelphoi-logo.jpg', 'public/logo-caya.png', 'public/logo-kiddos.png', 'public/logo-amen.png', 'public/logo-womisso.png')

foreach ($l in $logos) {
    if (Test-Path $l) {
        $b = New-Object System.Drawing.Bitmap $l
        $minY = $b.Height; $maxY = 0
        for ($y = 0; $y -lt $b.Height; $y++) {
            for ($x = 0; $x -lt $b.Width; $x++) {
                $p = $b.GetPixel($x, $y)
                if ($p.A -gt 50 -and ($p.R -lt 220 -or $p.G -lt 220 -or $p.B -lt 220)) {
                    if ($y -lt $minY) { $minY = $y }
                    if ($y -gt $maxY) { $maxY = $y }
                }
            }
        }
        $center = [int](($minY + $maxY) / 2)
        $canvasCenter = [int]($b.Height / 2)
        $diff = $center - $canvasCenter
        Write-Output "$l : Canvas $($b.Height), Content Y: $minY to $maxY, Center: $center vs $canvasCenter (Diff: $diff)"
        $b.Dispose()
    }
}
