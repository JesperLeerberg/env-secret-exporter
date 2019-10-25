[![Build Status](https://travis-ci.org/leerberg/env-secret-exporter.svg?branch=master)](https://travis-ci.org/leerberg/env-secret-exporter) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=leerberg_env-secret-exporter%3Amaster&metric=alert_status)](https://sonarcloud.io/dashboard?id=leerberg_env-secret-exporter%3Amaster) [![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=leerberg_env-secret-exporter%3Amaster&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=leerberg_env-secret-exporter%3Amaster) [![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=leerberg_env-secret-exporter%3Amaster&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=leerberg_env-secret-exporter%3Amaster) [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=leerberg_env-secret-exporter%3Amaster&metric=security_rating)](https://sonarcloud.io/dashboard?id=leerberg_env-secret-exporter%3Amaster) [![Bugs](https://sonarcloud.io/api/project_badges/measure?project=leerberg_env-secret-exporter%3Amaster&metric=bugs)](https://sonarcloud.io/dashboard?id=leerberg_env-secret-exporter%3Amaster) [![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=leerberg_env-secret-exporter%3Amaster&metric=code_smells)](https://sonarcloud.io/dashboard?id=leerberg_env-secret-exporter%3Amaster) [![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=leerberg_env-secret-exporter%3Amaster&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=leerberg_env-secret-exporter%3Amaster) ![license: MIT](https://img.shields.io/badge/License-MIT-blue.svg)


The env-secret-exporter is a CLI tool that allows you to quickly upload content of a `.env` file to the [AWS Secret Manager](https://aws.amazon.com/secrets-manager/).

# Installation

The fastest way to install the cli is by using NPM. 
```
$ npm install -g env-secret-exporter
```
This command installs the CLI globally on your system allowing you to run it from anywhere. If you want a local installation just remove the ``` -g ``` flag. 

# Usage

## The env-secret-exporter cli


Run the cli directly from your command line like shown in the example below. For more advanced usage please have a look at the [command line options.](#Command-Line-Options)

```
env-secret-exporter --env-file x.env --secret-name app_x_dev
```


## Using env-secret-exporter as a library

This code can be easily used within your JavaScript projects as a Node.js module. The only thing needed is to pass the options object and wait for the promise to return. The code snippet below shows an usage example. This functionallity can be useful if you are exporting multiple env files by making a script instead of doing it manually via the commandline. 

```javascript
const ese = require('env-secret-exporter');

async function exportSecret() {
  await ese({
    envFile: '.env',
    secretName: 'app_x_secret_dev'
  });
}

exportSecret()
```

## AWS Credentials
 
The aws credentials will be loaded through the normal aws security order as explained the [SDK credentials section](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html). I recommend that the shared credential file is used for commandline execution.

## Command Line Options

### `env-secret-exporter [options]`

- `-e`, `--env-file`
  The relative path to the environment file which will be exported.
  <br />

- `--secret-name`
  the secret name that is stored in the AWS secret manager. Please follow AWS naming guidlines: _Secret name must contain only alphanumeric characters and the characters /_+=.@-_
  <br />

- `-x`
  Feature flag used to specify which lines in a .env file that should be exported. Simply append a ' x' at the end of the line you want to export. If this flag is set all lines without ' x' will be omitted.
  <br />

- `--update-secret`
  Use this parameter if you are overwritting an existing secret.
  <br />
- `--accesss-key-id`
  AWS access key. Enables runtime specification of an IAM user.
  <br />
- `--secret-access-key`
  AWS secret access key. Enables runtime specification of an IAM user.
  <br />
- `--aws-region`
  Specific AWS region. By default the CLI reads the default region from the ~/.aws/config.

## Contributing

Please fell free to contribute by making pull requests. Ensure the README is updated if changes are made.

### ToDo

- [ ] Add docker setup. Including dockerfile and docker-compose file.
- [ ] Add tests
