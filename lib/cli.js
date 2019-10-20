import arg from 'arg';
import inquirer from 'inquirer';
import { getAwsRegion } from './utils';

async function parseArgs(rawArgs) {
  const args = arg(
    {
      '--env-file': String,
      '--secret-name': String,
      '--accesss-key-id': String,
      '--secret-access-key': String,
      '-x': Boolean,
      '--aws-region': String,
      '--update-secret': Boolean,
      '-e': '--env-file'
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    secretName: args['--secret-name'],
    envFile: args['--env-file'],
    x: args['-x'] || false,
    updateSecret: args['--update-secret'] || false,
    awsRegion: args['--aws-region'] || await getAwsRegion(),
    awsCredentials: {
      aws_access_key_id: args['--accesss-key-id'] || 'undefined',
      aws_secret_access_key: args['--secret-access-key'] || 'undefined'
    }
  };
}

async function checkOptions(options) {
  const questions = [];

  if (!process.env.AWS_DEFAULT_PROFILE && options.awsCredentials.aws_access_key_id === 'undefined') {
    console.log('Warning no AWS_DEFAULT_PROFILE set or aws credentials provided')
    questions.push({
      type: 'input',
      name: 'aws_access_key_id',
      message: 'AWS access key id:'
    });
    questions.push({
      type: 'input',
      name: 'aws_secret_access_key',
      message: 'AWS secret access key:'
    });
  }

  if (!options.secretName) {
    questions.push({
      type: 'input',
      name: 'secretName',
      message: 'Secret name:'
    });
  }

  if (!options.envFile) {
    questions.push({
      type: 'input',
      name: 'envFile',
      message: 'Path to env file:'
    });
  }
  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    awsCredentials: {
      aws_access_key_id: answers.aws_access_key_id || options.awsCredentials.aws_access_key_id,
      aws_secret_access_key: answers.aws_secret_access_key || options.awsCredentials.aws_secret_access_key
    },
    awsRegion: options.awsRegion,
    x: options.x,
    updateSecret: options.updateSecret,
    secretName: options.secretName || answers.secretName,
    envFile: options.envFile || answers.envFile,
  };
}

export async function cli(args) {
  try {
    let options = await parseArgs(args);
    options = await checkOptions(options);
    await require('./main')(options);
  } catch (err) {
    console.log(err)
  }
}