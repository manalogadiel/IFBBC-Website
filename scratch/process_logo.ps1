Add-Type -AssemblyName System.Drawing

$src = New-Object System.Drawing.Bitmap 'public/logo.jpg'

# 1. Create a perfectly centered high-res cropped badge (640x640) around the emblem (centerX: 513, centerY: 497)
$cropSize = 640
$cropX = [Math]::Max(0, [int](513 - $cropSize / 2))
$cropY = [Math]::Max(0, [int](497 - $cropSize / 2))

$cropped = New-Object System.Drawing.Bitmap $cropSize, $cropSize, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($cropped)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$srcRect = New-Object System.Drawing.Rectangle $cropX, $cropY, $cropSize, $cropSize
$destRect = New-Object System.Drawing.Rectangle 0, 0, $cropSize, $cropSize
$g.DrawImage($src, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()

$cropped.Save('public/logo-hd.png', [System.Drawing.Imaging.ImageFormat]::Png)
Write-Output "Saved public/logo-hd.png: $($cropped.Width)x$($cropped.Height)"

# 2. Also create an isolated transparent emblem PNG (just the white cross, bible, and text with transparent background)
$emblem = New-Object System.Drawing.Bitmap $cropSize, $cropSize, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
for ($y = 0; $y -lt $cropSize; $y++) {
    for ($x = 0; $x -lt $cropSize; $x++) {
        $p = $cropped.GetPixel($x, $y)
        # Calculate brightness / luminance
        $brightness = ($p.R * 0.299 + $p.G * 0.587 + $p.B * 0.114)
        if ($brightness -gt 150) {
            # Normalize alpha based on brightness
            $alpha = [Math]::Min(255, [int](($brightness - 150) * 2.6))
            $color = [System.Drawing.Color]::FromArgb($alpha, 255, 255, 255)
            $emblem.SetPixel($x, $y, $color)
        } else {
            $emblem.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
        }
    }
}
$emblem.Save('public/logo-emblem-transparent.png', [System.Drawing.Imaging.ImageFormat]::Png)
Write-Output "Saved public/logo-emblem-transparent.png: $($emblem.Width)x$($emblem.Height)"

$cropped.Dispose()
$emblem.Dispose()
$src.Dispose()
