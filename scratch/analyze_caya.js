import fs from 'fs';
import { PNG } from 'pngjs';

const data = fs.readFileSync('public/logo-caya.png');
const png = PNG.sync.read(data);

console.log(`Dimensions: ${png.width}x${png.height}`);

let minY = png.height, maxY = 0, minX = png.width, maxX = 0;

for (let y = 0; y < png.height; y++) {
  for (let x = 0; x < png.width; x++) {
    const idx = (png.width * y + x) << 2;
    const r = png.data[idx];
    const g = png.data[idx + 1];
    const b = png.data[idx + 2];
    const a = png.data[idx + 3];

    // check dark content
    if (a > 50 && (r < 220 || g < 220 || b < 220)) {
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
    }
  }
}

console.log(`Content X: ${minX} to ${maxX} (width: ${maxX - minX})`);
console.log(`Content Y: ${minY} to ${maxY} (height: ${maxY - minY})`);
console.log(`Content Center Y: ${(minY + maxY) / 2}, Canvas Center Y: ${png.height / 2}`);
