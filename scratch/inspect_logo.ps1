Add-Type -AssemblyName System.Drawing

$b = New-Object System.Drawing.Bitmap 'public/pwa-maskable-512x512.png'
# Scan the 512x512 maskable icon
for ($y = 0; $y -lt 512; $y += 16) {
    $line = ""
    for ($x = 0; $x -lt 512; $x += 8) {
        $p = $b.GetPixel($x, [Math]::Min($y, $b.Height - 1))
        $lum = $p.R * 0.299 + $p.G * 0.587 + $p.B * 0.114
        if ($lum -gt 150) {
            $line += "#"
        } elseif ($lum -gt 70) {
            $line += "."
        } else {
            $line += " "
        }
    }
    Write-Output $line
}
$b.Dispose()



