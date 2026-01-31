const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#0d1117"/>
  <circle cx="25" cy="25" r="10" fill="#7c3aed"/>
  <circle cx="75" cy="25" r="10" fill="#7c3aed"/>
  <circle cx="25" cy="75" r="10" fill="#2563eb"/>
  <circle cx="75" cy="75" r="10" fill="#2563eb"/>
  <line x1="25" y1="25" x2="75" y2="25" stroke="#7c3aed" stroke-width="4"/>
  <line x1="25" y1="75" x2="75" y2="75" stroke="#2563eb" stroke-width="4"/>
  <line x1="25" y1="25" x2="25" y2="75" stroke="#5b4cdb" stroke-width="4"/>
  <line x1="75" y1="25" x2="75" y2="75" stroke="#5b4cdb" stroke-width="4"/>
</svg>`;

async function generateFavicons() {
  const svgBuffer = Buffer.from(svgContent);
  
  // Generate PNG files
  await sharp(svgBuffer)
    .resize(16, 16)
    .png()
    .toFile('favicon-16x16.png');
  console.log('Created favicon-16x16.png');

  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile('favicon-32x32.png');
  console.log('Created favicon-32x32.png');

  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile('apple-touch-icon.png');
  console.log('Created apple-touch-icon.png');

  // Generate 48x48 for ICO
  const png48 = await sharp(svgBuffer)
    .resize(48, 48)
    .png()
    .toBuffer();

  const png32 = await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toBuffer();

  const png16 = await sharp(svgBuffer)
    .resize(16, 16)
    .png()
    .toBuffer();

  // Create a simple ICO file (just using the 32x32 PNG for simplicity)
  // ICO header format: https://en.wikipedia.org/wiki/ICO_(file_format)
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // Reserved
  icoHeader.writeUInt16LE(1, 2); // Type: 1 for ICO
  icoHeader.writeUInt16LE(3, 4); // Number of images

  // Image entries (16 bytes each)
  const entries = [];
  const images = [
    { size: 16, data: png16 },
    { size: 32, data: png32 },
    { size: 48, data: png48 }
  ];

  let offset = 6 + (16 * images.length); // Header + entries

  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.size, 0); // Width
    entry.writeUInt8(img.size, 1); // Height
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(img.data.length, 8); // Size of image data
    entry.writeUInt32LE(offset, 12); // Offset to image data
    entries.push(entry);
    offset += img.data.length;
  }

  const icoBuffer = Buffer.concat([
    icoHeader,
    ...entries,
    ...images.map(img => img.data)
  ]);

  fs.writeFileSync('favicon.ico', icoBuffer);
  console.log('Created favicon.ico');

  console.log('All favicons generated successfully!');
}

generateFavicons().catch(console.error);
