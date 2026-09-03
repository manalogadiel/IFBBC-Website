import { execSync } from 'child_process';
import ffmpeg from 'ffmpeg-static';

const folder = 'C:/Users/gadie/.gemini/antigravity-ide/brain/1f5bf036-66f2-4ca8-a022-ae318e960e8b/.user_uploaded';
const pub = 'c:/Github Repositories and Projects/IFBBC-Website/public';

// KIDDOS: Full height 554x554 square crop centered horizontally at X=512 (left offset = 235)
execSync(`"${ffmpeg}" -y -i "${folder}/media_1788453563071.jpg" -vf "crop=554:554:235:0,scale=800:800" "${pub}/logo-kiddos.png"`);

// AMEN: copy our perfected seamless centered version to public/logo-amen.png
execSync(`"${ffmpeg}" -y -i "${folder}/media_1788453559957.jpg" -vf "scale=880:880,pad=1024:1024:72:115:color=0x0e0e0e,scale=800:800" "${pub}/logo-amen.png"`);

console.log('Updated kiddos and amen in public/');
