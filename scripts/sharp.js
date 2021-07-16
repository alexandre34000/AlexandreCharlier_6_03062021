const sharp = require('sharp');
const fs = require('fs');
const directory = './images';

fs.readdirSync(directory).forEach(file => {
  sharp(`${directory}/${file}`)
    .resize(1050, 900) // width, height  .resize({ width: 1050})
    .toFile(`${directory}/${file}-small.jpg`);
  });

