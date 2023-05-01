const fs = require("fs");
const https = require('https');
const path = require('path');

const fileUrl = 'https://busic.net/music/0-0-1-20909-20';
const fileName = 'MyFavoriteSong.mp3';
const filePath = path.join(__dirname, fileName);

fs.access(filePath, fs.constants.F_OK, (err) => {
  if (!err) {
    console.log(`File ${filePath} already exists`);
    return;
  }

  https.get(fileUrl, res => {
    const file = fs.createWriteStream(filePath);
    const totalBytes = parseInt(res.headers['content-length']);
    let downloadedBytes = 0;

    res.on('data', chunk => {
      downloadedBytes += chunk.length;
      const percent = ((downloadedBytes / totalBytes) * 100).toFixed(2);
      process.stdout.write(`Downloaded ${percent}%\r`);
    });

    res.pipe(file);

    file.on('finish', () => {
      console.log('\nDownload complete');
      file.close();

      const stats = fs.statSync(filePath);
      const fileSizeInBytes = stats.size;
      console.log(`File size: ${fileSizeInBytes} bytes`);
    });
  }).on('error', err => {
    console.error(`Error: ${err.message}`);
  });
});
