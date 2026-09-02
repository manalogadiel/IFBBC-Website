Add-Type -AssemblyName System.Drawing

$src = New-Object System.Drawing.Bitmap 'public/logo.jpg'

# The center of the church emblem is approx (513, 497) in the 1024x1022 image.
# The emblem width is 574px (from 226 to 800), height is 506px (from 244 to 750).
# Let's crop with size 800x800 so the emblem has approx 113px padding on each side (~71% fill ratio).
# This gives elegant breathing room so it is NEVER too zoomed in!

$cropSize = 820
$cropX = [Math]::Max(0, [int](513 - $cropSize / 2))
$cropY = [Math]::Max(0, [int](497 - $cropSize / 2))

# Adjust if beyond boundaries
if ($cropX + $cropSize -gt $src.Width) { $cropX = $src.Width - $cropSize }
if ($cropY + $cropSize -gt $src.Height) { $cropY = $src.Height - $cropSize }

$dest = New-Object System.Drawing.Bitmap 640, 640, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($dest)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$srcRect = New-Object System.Drawing.Rectangle $cropX, $cropY, $cropSize, $cropSize
$destRect = New-Object System.Drawing.Rectangle 0, 0, 640, 640
$g.DrawImage($src, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()

$dest.Save('public/logo-hd.png', [System.Drawing.Imaging.ImageFormat]::Png)
$dest.Save('src/assets/logo-hd.png', [System.Drawing.Imaging.ImageFormat]::Png)

# Also save high quality JPEG version
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]95)
$dest.Save('public/logo-hd.jpg', $codec, $ep)

$dest.Dispose()
$src.Dispose()

Write-Output "Successfully generated zoomed-out logo-hd.png (820px source area scaled to 640x640 with generous margin)!"
