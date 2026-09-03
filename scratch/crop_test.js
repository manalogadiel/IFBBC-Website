import { execSync } from 'child_process';
import path from 'path';
import ffmpeg from 'ffmpeg-static';

const folder = 'C:/Users/gadie/.gemini/antigravity-ide/brain/1f5bf036-66f2-4ca8-a022-ae318e960e8b/.user_uploaded';
const scratch = 'c:/Github Repositories and Projects/IFBBC-Website/scratch';

// 1. CAYA: Let's inspect center crop
execSync(`"${ffmpeg}" -y -i "${folder}/media_1788453547264.jpg" -vf "crop=700:700:162:162" "${scratch}/crop_caya_700.png"`);
execSync(`"${ffmpeg}" -y -i "${folder}/media_1788453547264.jpg" -vf "crop=600:600:212:212" "${scratch}/crop_caya_600.png"`);

// 2. WOMISSO: Let's inspect circular emblem area (centered at ~512, 288)
execSync(`"${ffmpeg}" -y -i "${folder}/media_1788453553504.jpg" -vf "crop=500:500:262:38" "${scratch}/crop_womisso_500.png"`);
execSync(`"${ffmpeg}" -y -i "${folder}/media_1788453553504.jpg" -vf "crop=440:440:292:68" "${scratch}/crop_womisso_440.png"`);

// 3. AMEN: 1024x1024 - content is from X~110 to 890, Y~280 to 700. Center of content is ~(500, 490)
execSync(`"${ffmpeg}" -y -i "${folder}/media_1788453559957.jpg" -vf "crop=900:900:62:62" "${scratch}/crop_amen_900.png"`);

// 4. KIDDOS: 1024x554 - content is centered at ~(512, 275)
execSync(`"${ffmpeg}" -y -i "${folder}/media_1788453563071.jpg" -vf "crop=480:480:272:37" "${scratch}/crop_kiddos_480.png"`);
execSync(`"${ffmpeg}" -y -i "${folder}/media_1788453563071.jpg" -vf "crop=420:420:302:67" "${scratch}/crop_kiddos_420.png"`);

console.log('Crops generated successfully');
