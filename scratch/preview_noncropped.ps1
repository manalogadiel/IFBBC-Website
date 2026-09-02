Add-Type -AssemblyName System.Drawing

$img = [System.Drawing.Image]::FromFile('c:\Github Repositories and Projects\IFBBC-Website\src\assets\logo-hd.png')

$size = 240
$radius = 72 # rounded-xl

$bmp = New-Object System.Drawing.Bitmap $size, $size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.Clear([System.Drawing.Color]::Transparent)

$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$d = $radius * 2
$path.AddArc(0, 0, $d, $d, 180, 90)
$path.AddArc($size - $d, 0, $d, $d, 270, 90)
$path.AddArc($size - $d, $size - $d, $d, $d, 0, 90)
$path.AddArc(0, $size - $d, $d, $d, 90, 90)
$path.CloseFigure()

$brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 15, 23, 42))
$g.FillPath($brush, $path)
$g.SetClip($path)
$g.DrawImage($img, 0, 0, $size, $size)
$g.ResetClip()

$pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(120, 59, 130, 246), 4)
$g.DrawPath($pen, $path)

$bmp.Save('c:\Github Repositories and Projects\IFBBC-Website\scratch\preview_noncropped_badge.png', [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$bmp.Dispose()
$img.Dispose()

Write-Output "Generated preview_noncropped_badge.png!"
