import { execSync } from 'child_process';
import ffmpeg from 'ffmpeg-static';
import path from 'path';

const folder = 'C:/Users/gadie/.gemini/antigravity-ide/brain/1f5bf036-66f2-4ca8-a022-ae318e960e8b/.user_uploaded';
const pub = 'c:/Github Repositories and Projects/IFBBC-Website/public';
const scratch = 'c:/Github Repositories and Projects/IFBBC-Website/scratch';

console.log('Generating optimized core group logos...');

// 1. CAYA: 1024x1024 original. Logo center is X=512, Y=490.
// A 720x720 crop gives ~62% logo width (444px / 720px), leaving ~138px margin on each side (ideal breathing room).
// crop=720:720:(1024-720)/2:(490-360) = crop=720:720:152:130
execSync(`"${ffmpeg}" -y -i "${folder}/media_1788453547264.jpg" -vf "crop=720:720:152:130,scale=800:800" "${pub}/logo-caya.png"`);
console.log('Created logo-caya.png');

// 2. WOMISSO: 1024x576 original. White circular badge has diameter ~384px, center at (512, 288).
// If we crop 500x500 around (512, 288):
// crop=500:500:262:38.
// The white circular badge has radius 192px inside 250px radius, leaving 58px of gorgeous purple crystal margin all around the circle!
execSync(`"${ffmpeg}" -y -i "${folder}/media_1788453553504.jpg" -vf "crop=500:500:262:38,scale=800:800" "${pub}/logo-womisso.png"`);
console.log('Created logo-womisso.png');

// 3. A-MEN: 1024x1024 original. Content is from X=110 to 888 (width 778), Y=255 to 655 (height 400).
// Center of content is X=499, Y=455.
// To give proper spaces on the side of the circle:
// In a circle, width 778 at height 400 has diagonal sqrt(778^2 + 400^2) = 875px.
// If the crop canvas is 1080x1080 (or padded to 1100x1100), the content width 778 inside 1100 diameter circle has (1100 - 778)/2 = 161px space!
// Let's crop centered at (499, 455) with size 960x960, and pad to 1080x1080 with black background:
execSync(`"${ffmpeg}" -y -i "${folder}/media_1788453559957.jpg" -vf "crop=940:940:29:0,pad=1060:1060:60:60:color=black,scale=800:800" "${pub}/logo-amen.png"`);
console.log('Created logo-amen.png');

// 4. KIDDOS: 1024x554 original. Logo center is at X=512, Y=245.
// Logo bounding box is ~360px wide, ~160px tall.
// A 500x500 crop centered at (512, 245):
// crop=500:500:262:(245-250 < 0 ? 0 : 245-250) -> Y is from 0 to 500.
// Inside 500x500, logo width 360px leaves 70px margin on each side (70/250 = 28% side margin).
execSync(`"${ffmpeg}" -y -i "${folder}/media_1788453563071.jpg" -vf "crop=500:500:262:0,scale=800:800" "${pub}/logo-kiddos.png"`);
console.log('Created logo-kiddos.png');

console.log('All 4 logos generated in public/');
