$uploadedPath = 'C:\Users\gadie\.gemini\antigravity-ide\brain\0099339a-1f0d-45aa-b275-97b8c8a72788\.user_uploaded\media_1788375578279.jpg'

Add-Type -AssemblyName System.Drawing

$fileStream = [System.IO.File]::OpenRead($uploadedPath)
$rawImg = [System.Drawing.Image]::FromStream($fileStream)
$bmp = New-Object System.Drawing.Bitmap $rawImg
$fileStream.Close()
$rawImg.Dispose()

# Save uncropped full resolution PNG to src/assets/logo-hd.png and public/logo-hd.png
$bmp.Save('c:\Github Repositories and Projects\IFBBC-Website\src\assets\logo-hd.png', [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save('c:\Github Repositories and Projects\IFBBC-Website\public\logo-hd.png', [System.Drawing.Imaging.ImageFormat]::Png)

# Save uncropped full resolution JPG to public/logo.jpg and public/logo-hd.jpg
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]100)

$bmp.Save('c:\Github Repositories and Projects\IFBBC-Website\public\logo.jpg', $codec, $ep)
$bmp.Save('c:\Github Repositories and Projects\IFBBC-Website\public\logo-hd.jpg', $codec, $ep)

$bmp.Dispose()

Write-Output "Successfully updated logo assets with non-cropped uploaded media!"
