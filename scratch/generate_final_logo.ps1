Add-Type -AssemblyName System.Drawing

$rawStream = [System.IO.File]::OpenRead('c:\Github Repositories and Projects\IFBBC-Website\public\logo.jpg')
$rawImg = [System.Drawing.Image]::FromStream($rawStream)
$src = New-Object System.Drawing.Bitmap $rawImg
$rawStream.Close()
$rawImg.Dispose()

$cropSize = 670
$cropX = [int](507 - $cropSize / 2) # 507 - 335 = 172
$cropY = [int](497 - $cropSize / 2) # 497 - 335 = 162

$dest = New-Object System.Drawing.Bitmap 800, 800, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($dest)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$srcRect = New-Object System.Drawing.Rectangle $cropX, $cropY, $cropSize, $cropSize
$destRect = New-Object System.Drawing.Rectangle 0, 0, 800, 800
$g.DrawImage($src, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$src.Dispose()

# Save crystal-clear 800x800 PNGs
$dest.Save('c:\Github Repositories and Projects\IFBBC-Website\public\logo-hd.png', [System.Drawing.Imaging.ImageFormat]::Png)
$dest.Save('c:\Github Repositories and Projects\IFBBC-Website\src\assets\logo-hd.png', [System.Drawing.Imaging.ImageFormat]::Png)

# Also high quality JPG
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]98)
$dest.Save('c:\Github Repositories and Projects\IFBBC-Website\public\logo-hd.jpg', $codec, $ep)

$dest.Dispose()

Write-Output "Successfully generated 800x800 logo-hd.png with 670px crop!"
