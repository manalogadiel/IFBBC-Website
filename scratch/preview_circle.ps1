Add-Type -AssemblyName System.Drawing

$img = [System.Drawing.Image]::FromFile('c:\Github Repositories and Projects\IFBBC-Website\src\assets\logo-hd.png')

$size = 240
$bmp = New-Object System.Drawing.Bitmap $size, $size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.Clear([System.Drawing.Color]::Transparent)

$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$path.AddEllipse(0, 0, $size, $size)

$g.SetClip($path)
$g.DrawImage($img, 0, 0, $size, $size)
$g.ResetClip()

$pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(120, 59, 130, 246), 4)
$g.DrawPath($pen, $path)

$bmp.Save('c:\Github Repositories and Projects\IFBBC-Website\scratch\preview_circle_noncropped.png', [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$bmp.Dispose()
$img.Dispose()

Write-Output "Generated preview_circle_noncropped.png!"
