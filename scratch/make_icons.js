import ffmpeg from 'ffmpeg-static';
import { execFileSync } from 'child_process';
import path from 'path';

try {
  execFileSync(ffmpeg, ['-y', '-i', 'public/logo-hd.png', '-vf', 'scale=192:192', 'public/pwa-192x192.png']);
  execFileSync(ffmpeg, ['-y', '-i', 'public/logo-hd.png', '-vf', 'scale=512:512', 'public/pwa-512x512.png']);
  execFileSync(ffmpeg, ['-y', '-i', 'public/logo-hd.png', '-vf', 'scale=180:180', 'public/apple-touch-icon.png']);
  console.log('PWA icons created successfully!');
} catch (e) {
  console.error('Error generating icons:', e);
}
