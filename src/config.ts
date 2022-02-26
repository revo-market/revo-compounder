import * as yargs from 'yargs'
import yargsParser from 'yargs-parser'
import { loadSecret } from '@valora/secrets-loader'
import { CompounderConfig, isNetwork } from './types'

/**
 * Private keys should be secured with Google Secrets Manager, rather than
 *  included in an unencrypted config file.
 *
 * This takes the secret name from the config params or environment, loads the private key from
 *  GSM, and adds the private key to the environment.
 */
async function loadPrivateKeyIntoEnv() {
  const privateKeySecretName = yargsParser(process.argv.slice(2), {
    envPrefix: '',
  }).privateKeySecretName as string
  if (!privateKeySecretName) {
    throw new Error(
      'Missing required config parameter: private-key-secret-name',
    )
  }
  Object.assign(process.env, await loadSecret(privateKeySecretName))
}

export async function getCompounderConfig(): Promise<CompounderConfig> {
  await loadPrivateKeyIntoEnv()

  const argv = await yargs
    .env('')
    .option('private-key', {
      description:
        'Private key to use for calling config. Must be authorized compounder for farm bot. NOTE: should NOT be passed in as unencrypted environment variable! (Instead, set private-key-secret-name to name of Google Cloud Secret containing PRIVATE_KEY=<your-private-key>)',
      type: 'string',
      demandOption: true,
    })
    .option('gas', {
      description: 'Amount of gas to use',
      type: 'number',
      default: 3000000,
    })
    .option('gas-price', {
      description: 'Gas price',
      type: 'number',
      default: 1000000000,
    })
    .option('deadline-seconds-ahead', {
      description:
        'How far ahead the deadline for the transaction should be, in seconds',
      type: 'number',
      default: 300, // five min
    })
    .option('network', {
      description: 'Network to use',
      type: 'string',
      choices: ['ALFAJORES', 'MAINNET'],
      default: 'MAINNET',
    })
    .option('farm-bot-names', {
      description: 'Comma-separated names of farm bots to compound for',
      type: 'string',
      example: 'mcUSD-mcEUR-ubeswap',
      demandOption: true,
    }).argv

  if (!isNetwork(argv.network)) {
    throw new Error('Invalid network name: ' + argv.network)
  }
  return {
    privateKey: argv.privateKey,
    network: argv.network,
    deadlineSecondsAhead: argv.deadlineSecondsAhead,
    gas: argv.gas,
    gasPrice: argv.gasPrice,
    farmBotNames: argv.farmBotNames.split(','),
  }
}
