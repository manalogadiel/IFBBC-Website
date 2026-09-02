Add-Type -AssemblyName System.Drawing

$fileStream = [System.IO.File]::OpenRead('public/logo.jpg')
$rawImg = [System.Drawing.Image]::FromStream($fileStream)
$src = New-Object System.Drawing.Bitmap $rawImg
$fileStream.Close()
$rawImg.Dispose()

$cropSize = 616
$cropX = [int](507 - $cropSize / 2) # 199
$cropY = [int](497 - $cropSize / 2) # 189

$dest = New-Object System.Drawing.Bitmap 640, 640, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($dest)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$srcRect = New-Object System.Drawing.Rectangle $cropX, $cropY, $cropSize, $cropSize
$destRect = New-Object System.Drawing.Rectangle 0, 0, 640, 640
$g.DrawImage($src, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$src.Dispose()

$dest.Save('public/logo-hd.png', [System.Drawing.Imaging.ImageFormat]::Png)
$dest.Save('src/assets/logo-hd.png', [System.Drawing.Imaging.ImageFormat]::Png)

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]95)
$dest.Save('public/logo-hd.jpg', $codec, $ep)
$dest.Save('public/logo.jpg', $codec, $ep)

$dest.Dispose()

Write-Output "Successfully saved fitted logo-hd.png and logo.jpg without GDI+ lock!"
