import { FarmBot, Config, FarmBotConfig, Address, FarmBotContract } from '../types'
import { ContractKit } from "@celo/contractkit";
import UBESWAP_FARM_BOT_ABI from '../constants/abis/UbeswapFarmBot.json'

import { AbiItem } from 'web3-utils';

export abstract class BaseFarmBotClient implements FarmBot {
  farmBotConfig: FarmBotConfig
  config: Config
  kit: ContractKit
  contract: FarmBotContract

  constructor(farmBotConfig: FarmBotConfig, config: Config, kit: ContractKit) {
    this.farmBotConfig = farmBotConfig
    this.config = config
    this.kit = kit
    // Ideally, this should be a generic FarmBot "interface" that all individual farms implement
    this.contract = new kit.web3.eth.Contract(UBESWAP_FARM_BOT_ABI.abi as AbiItem[], farmBotConfig.farmAddress)
  }

  async runCompoundTask(): Promise<void> {
    const paths = await this.getPaths()
    const minAmountsOut = await this.getMinAmountsOut()
    const tenSecondsFromNowDeadline = Math.floor((new Date().getTime())/1000 + 10)
    await this.compound(paths, minAmountsOut, tenSecondsFromNowDeadline)
  }

  abstract getPaths(): Promise<Address[][][]>
  abstract getMinAmountsOut(): Promise<number[][]>

  async getName(): Promise<string> {
    return this.farmBotConfig.name
  }

  async compound(
    paths: Address[][][],
    minAmountsOut: number[][],
    deadline: number
  ): Promise<void> {
    await this.contract.methods.compound(
      paths,
      minAmountsOut,
      deadline
    ).send({
      from: this.kit.web3.eth.defaultAccount as string,
      gas: this.config.gas,
      gasPrice: this.config.gasPrice
    })
  }
}
