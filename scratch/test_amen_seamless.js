import { execSync } from 'child_process';
import ffmpeg from 'ffmpeg-static';

const folder = 'C:/Users/gadie/.gemini/antigravity-ide/brain/1f5bf036-66f2-4ca8-a022-ae318e960e8b/.user_uploaded';
const scratch = 'c:/Github Repositories and Projects/IFBBC-Website/scratch';

// Shift vertically so content center (Y=455) moves to canvas center (Y=512)
// dy = 512 - 455 = +57px.
// We scale to 880x880, then pad to 1024x1024 with background 0x0e0e0e, placing it at (1024-880)/2 = 72 on X,
// and Y offset: 72 + 57*(880/1024) = 72 + 49 = 121!
execSync(`"${ffmpeg}" -y -i "${folder}/media_1788453559957.jpg" -vf "scale=880:880,pad=1024:1024:72:115:color=0x0e0e0e,scale=800:800" "${scratch}/amen_centered.png"`);
console.log('AMEN centered generated');
