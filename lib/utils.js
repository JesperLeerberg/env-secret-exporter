const fs = require('fs');
const os = require('os');

async function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

async function getAwsRegion() {
  const config = await readFile(os.homedir + '/.aws/config')
  return config.split('=')[2].trim();
}

module.exports = {
  readFile: readFile,
  getAwsRegion: getAwsRegion
}