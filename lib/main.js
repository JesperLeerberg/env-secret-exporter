import AWS from 'aws-sdk';
import { readFile } from './utils';

module.exports = async function (options) {
  AWS.config.update({ region: options.awsRegion });
  const secretsmanager = new AWS.SecretsManager();
  const SecretString = await parseEnvFile(options)

  const params = {
    Name: options.secretName,
    SecretString: SecretString,
  };

  if (options.updateSecret) {
    await secretsmanager.updateSecret(params).promise();
  } else {
    await secretsmanager.createSecret(params).promise();
  }
}

export async function parseEnvFile(options) {
  const content = await readFile(options.envFile)
  const lineArg = content.split("\n")

  let objects = {};

  lineArg.forEach(e => {
    const res = e.split("=");

    if (options.x) {
      if (res[1].endsWith(" x")) {
        objects[res[0]] = res[1].slice(0, -2);
      }
    } else {
      objects[res[0]] = res[1];
    }
  });

  return JSON.stringify(objects)
}