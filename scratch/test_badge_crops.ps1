Add-Type -AssemblyName System.Drawing

$rawStream = [System.IO.File]::OpenRead('c:\Github Repositories and Projects\IFBBC-Website\public\logo.jpg')
$rawImg = [System.Drawing.Image]::FromStream($rawStream)
$src = New-Object System.Drawing.Bitmap $rawImg
$rawStream.Close()
$rawImg.Dispose()

# Test sizes: 650, 680, 710
$testSizes = @(650, 675, 700)

foreach ($cropSize in $testSizes) {
    $cropX = [int](507 - $cropSize / 2)
    $cropY = [int](497 - $cropSize / 2)

    $dest = New-Object System.Drawing.Bitmap 640, 640, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($dest)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $srcRect = New-Object System.Drawing.Rectangle $cropX, $cropY, $cropSize, $cropSize
    $destRect = New-Object System.Drawing.Rectangle 0, 0, 640, 640
    $g.DrawImage($src, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()

    # Now simulate badge render
    $size = 200
    $radius = 60
    $bmp = New-Object System.Drawing.Bitmap $size, $size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $gb = [System.Drawing.Graphics]::FromImage($bmp)
    $gb.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $gb.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gb.Clear([System.Drawing.Color]::Transparent)

    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $radius * 2
    $path.AddArc(0, 0, $d, $d, 180, 90)
    $path.AddArc($size - $d, 0, $d, $d, 270, 90)
    $path.AddArc($size - $d, $size - $d, $d, $d, 0, 90)
    $path.AddArc(0, $size - $d, $d, $d, 90, 90)
    $path.CloseFigure()

    $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 15, 23, 42))
    $gb.FillPath($brush, $path)
    $gb.SetClip($path)
    $gb.DrawImage($dest, 0, 0, $size, $size)
    $gb.ResetClip()

    $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(100, 59, 130, 246), 4)
    $gb.DrawPath($pen, $path)

    $bmp.Save("c:\Github Repositories and Projects\IFBBC-Website\scratch\preview_badge_$cropSize.png", [System.Drawing.Imaging.ImageFormat]::Png)

    $gb.Dispose()
    $bmp.Dispose()
    $dest.Dispose()
}

$src.Dispose()
Write-Output "Generated previews for 650, 675, 700!"
