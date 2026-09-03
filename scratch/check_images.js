import { execSync } from 'child_process';
import path from 'path';
import ffmpeg from 'ffmpeg-static';

const folder = 'C:/Users/gadie/.gemini/antigravity-ide/brain/1f5bf036-66f2-4ca8-a022-ae318e960e8b/.user_uploaded';
const files = [
  { name: 'caya', file: 'media_1788453547264.jpg' },
  { name: 'womisso', file: 'media_1788453553504.jpg' },
  { name: 'amen', file: 'media_1788453559957.jpg' },
  { name: 'kiddos', file: 'media_1788453563071.jpg' }
];

for (const item of files) {
  const filePath = path.join(folder, item.file);
  try {
    execSync(`"${ffmpeg}" -i "${filePath}"`, { stdio: 'pipe' });
  } catch (err) {
    const stderr = err.stderr ? err.stderr.toString() : '';
    const match = stderr.match(/Stream #0:0.*: Video: .*, ([0-9]+x[0-9]+)/);
    console.log(item.name, item.file, match ? match[1] : 'unknown');
  }
}
