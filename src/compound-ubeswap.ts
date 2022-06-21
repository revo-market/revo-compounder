import { ContractKit } from '@celo/contractkit'
import { UbeswapFarmBotConfig, UbeswapFarmBotContract } from './types'
import log from './log'
import BigNumber from 'bignumber.js'
import { AbiItem } from 'web3-utils'

export function getUbeswapFarmBotContract(
  kit: ContractKit,
  abi: AbiItem[] | AbiItem,
  address: string,
): UbeswapFarmBotContract {
  return new kit.web3.eth.Contract(abi, address)
}

async function getPathsUbeswap({
  pathsDefault,
}: {
  stakingTokens: [string, string]
  rewardsTokens: string[]
  pathsDefault: [string[], string[]][]
}): Promise<[string[], string[]][]> {
  return pathsDefault
}

async function getMinAmountsUbeswap(
  paths: [string[], string[]][],
): Promise<[number, number][]> {
  return paths.map(() => [0,0])
}

export async function compoundUbeswap({
  kit,
  farmBotConfig,
  compounderAddress,
  gas,
  gasPrice,
  deadlineSecondsAhead,
}: {
  kit: ContractKit
  farmBotConfig: UbeswapFarmBotConfig
  compounderAddress: string
  gas: number
  gasPrice: number
  deadlineSecondsAhead: number
}): Promise<void> {
  const farmBotContract = getUbeswapFarmBotContract(
    kit,
    farmBotConfig.abi,
    farmBotConfig.farmAddress,
  )
  const paths = await getPathsUbeswap(farmBotConfig)
  const minAmountsOut = await getMinAmountsUbeswap(paths)

  log.info(`Compounding for farm ${farmBotConfig.name}`)
  const result = await farmBotContract.methods
    .compound(
      paths,
      minAmountsOut,
      new BigNumber(Date.now())
        .dividedToIntegerBy(1000)
        .plus(deadlineSecondsAhead),
    )
    .send({
      from: compounderAddress,
      gas,
      gasPrice,
    })
  log.info(`tx result status: ${result.status}`)
}
