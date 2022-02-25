import { Config, FarmBotConfig, Address } from '../types'
import { BaseFarmBotClient } from './base-farm-bot-client'
import { ContractKit } from "@celo/contractkit";
//import { BigNumber } from 'bignumber.js'

export class UbeswapFarmBotClient extends BaseFarmBotClient {

  constructor(farmBotConfig: FarmBotConfig, config: Config, kit: ContractKit) {
    super(farmBotConfig, config, kit)
  }

  async getPaths(): Promise<Address[][][]> {
    if (this.farmBotConfig.paths) {
      return this.farmBotConfig.paths
    } else {
      throw new Error('Must hardcode swap paths for now.')
    }
  }

  async getMinAmountsOut(): Promise<number[][]> {
    if (this.farmBotConfig.minAmountsOut) {
      return this.farmBotConfig.minAmountsOut
    } else {
      throw new Error('Must hardcode min amounts out for now.')
    }
  }
}
