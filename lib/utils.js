import fs from 'fs';
import os from 'os';

export async function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

export async function getAwsRegion() {
  const config = await readFile(os.homedir + '/.aws/config')
  return config.split('=')[2].trim();
}