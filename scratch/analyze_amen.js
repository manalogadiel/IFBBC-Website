import { execSync } from 'child_process';
import ffmpeg from 'ffmpeg-static';
import fs from 'fs';

const folder = 'C:/Users/gadie/.gemini/antigravity-ide/brain/1f5bf036-66f2-4ca8-a022-ae318e960e8b/.user_uploaded';
const scratch = 'c:/Github Repositories and Projects/IFBBC-Website/scratch';

// Extract 10x10 raw pixels from top-left (0,0) of AMEN image to inspect RGB values
execSync(`"${ffmpeg}" -y -i "${folder}/media_1788453559957.jpg" -vf "crop=10:10:0:0" -f rawvideo -pix_fmt rgb24 "${scratch}/amen_corner.raw"`);

const buf = fs.readFileSync(`${scratch}/amen_corner.raw`);
console.log('AMEN pixel (0,0) RGB:', buf[0], buf[1], buf[2]);
console.log('Hex: #', buf[0].toString(16).padStart(2, '0') + buf[1].toString(16).padStart(2, '0') + buf[2].toString(16).padStart(2, '0'));
