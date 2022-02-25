import * as dotenv from 'dotenv'
import yargs from 'yargs'
import { Config } from './types'

export function loadConfig(): Config {
  dotenv.config()

  const argv = yargs
    .env('')
    .option('interval', {
      description: 'Interval in seconds at which to compound',
      example: '600',
      type: 'number',
      demandOption: true
    }).
    option('private-key', {
      description: 'Private key to use for calling autocompound method',
      example: 'your-private-key',
      type: 'string',
      demandOption: true
    }).
    option('gas', {
      description: 'Amount of gas to use',
      example: 5000000,
      type: 'number',
      default: 5000000
    }).
    option('gas-price', {
      description: 'Gas price to use',
      example: 1000000000,
      type: 'number',
      default: 1000000000
    }).parseSync()

  return {
    compoundInterval: argv.interval*1000,
    privateKey: argv['private-key'],
    gas: argv.gas,
    gasPrice: argv.gasPrice
  }
}
