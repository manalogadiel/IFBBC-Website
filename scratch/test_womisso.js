import { execSync } from 'child_process';
import ffmpeg from 'ffmpeg-static';
import fs from 'fs';

const folder = 'C:/Users/gadie/.gemini/antigravity-ide/brain/1f5bf036-66f2-4ca8-a022-ae318e960e8b/.user_uploaded';
const scratch = 'c:/Github Repositories and Projects/IFBBC-Website/scratch';

// Extract raw RGB or inspect center of white circle in WOMISSO
// Center is around X=512, Y=288.
// Let's test a crop centered at 512, 288 with size 520x520 (leaving 28px top and bottom from 576):
// crop=520:520:252:28
execSync(`"${ffmpeg}" -y -i "${folder}/media_1788453553504.jpg" -vf "crop=520:520:252:28" "${scratch}/womisso_520.png"`);

// Let's also test extracting just the circular badge with transparent background:
// The white circle in womisso has diameter ~390px.
// If we crop 460x460 around 512, 288:
execSync(`"${ffmpeg}" -y -i "${folder}/media_1788453553504.jpg" -vf "crop=460:460:282:58" "${scratch}/womisso_460.png"`);

// And what if we also test making the white circle fill with proper space:
execSync(`"${ffmpeg}" -y -i "${folder}/media_1788453553504.jpg" -vf "crop=400:400:312:88" "${scratch}/womisso_400.png"`);

console.log('WOMISSO crops done');
