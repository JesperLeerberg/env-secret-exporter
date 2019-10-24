const AWS = require('aws-sdk');
const { readFile, getAwsRegion } = require('./utils');
const Joi = require('@hapi/joi');

const schema = Joi.object({
  envFile: Joi.string().required(),
  secretName: Joi.string().required(),
  x: Joi.boolean().default(false),
  awsRegion: Joi.string().default('undefined'),
  updateSecret: Joi.boolean().default(false),
  awsCredentials: Joi.optional()
});

module.exports = async function (options) {
  try {
    const validatedOptions = await schema.validateAsync(options);
    const region = validatedOptions.awsRegion === 'undefined' ? await getAwsRegion() : validatedOptions.awsRegion
    let awsConf = { region: region }

    if (validatedOptions.awsCredentials.aws_access_key_id &&
      validatedOptions.awsCredentials.aws_secret_access_key) {
      awsConf.accessKeyId = validatedOptions.awsCredentials.aws_access_key_id
      awsConf.secretAccessKey = validatedOptions.awsCredentials.aws_secret_access_key
    }
    AWS.config.update(awsConf);
    const secretsmanager = new AWS.SecretsManager();
    const SecretString = await parseEnvFile(validatedOptions)

    const params = {
      Name: validatedOptions.secretName,
      SecretString: SecretString,
    };

    if (validatedOptions.updateSecret) {
      await secretsmanager.updateSecret(params).promise();
    } else {
      await secretsmanager.createSecret(params).promise();
    }
  } catch (err) {
    console.log(err)
  }
}

async function parseEnvFile(options) {
  const content = await readFile(options.envFile);
  const lineArg = content.split("\n");

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