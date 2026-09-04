Add-Type -AssemblyName System.Drawing

$pwa = [System.Drawing.Bitmap]::FromFile('public/pwa-512x512.png')
# Check pixel at (20, 20) vs (256, 20) vs (256, 256)
Write-Output "pwa-512x512 (20,20): $($pwa.GetPixel(20,20))"
Write-Output "pwa-512x512 (100,100): $($pwa.GetPixel(100,100))"
Write-Output "pwa-512x512 (256,256): $($pwa.GetPixel(256,256))"
$pwa.Dispose()








