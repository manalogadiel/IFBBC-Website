Add-Type -AssemblyName System.Drawing
$b = New-Object System.Drawing.Bitmap 'public/logo.jpg'

Write-Output "Center pixel (512, 511): $($b.GetPixel(512, 511))"
Write-Output "Top-left pixel (10, 10): $($b.GetPixel(10, 10))"
Write-Output "Mid-left pixel (10, 511): $($b.GetPixel(10, 511))"
Write-Output "Mid-top pixel (512, 10): $($b.GetPixel(512, 10))"
Write-Output "Bottom-right pixel (1000, 1000): $($b.GetPixel(1000, 1000))"

# Let's check where the outer circle / border of the logo is:
# Search horizontally along Y=511 from left to right for when pixel changes significantly from background:
$bg = $b.GetPixel(10, 511)
Write-Output "Background color at edge: R=$($bg.R), G=$($bg.G), B=$($bg.B)"

$b.Dispose()
