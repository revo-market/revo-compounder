import * as yargs from 'yargs'
import { CompounderConfig, isNetwork } from './types'

export async function getCompounderConfig(): Promise<CompounderConfig> {
  const argv = await yargs
    .env('')
    .option('private-key', {
      description:
        'Private key to use for calling config. Must be authorized compounder for farm bot.',
      type: 'string',
      demandOption: true,
    })
    .option('gas', {
      description: 'Amount of gas to use',
      type: 'number',
      default: 4e6,
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
