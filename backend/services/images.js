const sharp = require('sharp');
const fs = require('fs');

const optimizeImage = async (file) => {
  const originalPath = `images/${file.filename}`;
  const optimizedName = `opt_${file.filename.replace(/\.[^.]+$/, '')}.webp`;
  const optimizedPath = `images/${optimizedName}`; // careful: see note below


  await sharp(originalPath)
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(optimizedPath);

  fs.unlink(originalPath, (err) => {
    if (err) console.error('Original image cleanup failed:', err);
  });

  return optimizedName;
};

module.exports = { optimizeImage };
