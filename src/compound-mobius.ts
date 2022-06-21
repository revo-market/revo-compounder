import { ContractKit } from '@celo/contractkit'
import { MobiusFarmBotContract, MobiusFarmBotConfig } from './types'
import log from './log'
import BigNumber from 'bignumber.js'
import { AbiItem } from 'web3-utils'

export function getMobiusFarmBotContract(
  kit: ContractKit,
  abi: AbiItem[] | AbiItem,
  address: string,
): MobiusFarmBotContract {
  return new kit.web3.eth.Contract(abi, address)
}

async function getPathsMobius({
  pathsDefault,
}: {
  celoStakingToken: string
  rewardsTokens: string[]
  pathsDefault: string[][]
}): Promise<string[][]> {
  return pathsDefault
}

async function getMinAmountsMobius(
  paths: string[][],
): Promise<BigNumber[]> {
  return paths.map(() => new BigNumber(0))
}

async function getMinSwapOutMobius(_: {
  celoStakingToken: string
  bridgeStakingToken: string
}): Promise<BigNumber> {
  return new BigNumber(0)
}

async function getMinLiquidityMobius(_: {
  celoStakingToken: string
  bridgeStakingToken: string
  minSwapOut: BigNumber
  minAmounts: BigNumber[]
}): Promise<BigNumber> {
  return new BigNumber(0)
}

export async function compoundMobius({
  kit,
  farmBotConfig,
  compounderAddress,
  gas,
  gasPrice,
  deadlineSecondsAhead,
}: {
  kit: ContractKit
  farmBotConfig: MobiusFarmBotConfig
  compounderAddress: string
  gas: number
  gasPrice: number
  deadlineSecondsAhead: number
}): Promise<void> {
  const farmBotContract = getMobiusFarmBotContract(
    kit,
    farmBotConfig.abi,
    farmBotConfig.farmAddress,
  )
  const paths = await getPathsMobius(farmBotConfig)
  const minAmounts = await getMinAmountsMobius(paths)
  const minSwapOut = await getMinSwapOutMobius({celoStakingToken: farmBotConfig.celoStakingToken, bridgeStakingToken: farmBotConfig.bridgeStakingToken})
  const minLiquidity = await getMinLiquidityMobius({celoStakingToken: farmBotConfig.celoStakingToken, bridgeStakingToken: farmBotConfig.bridgeStakingToken, minSwapOut, minAmounts})

  log.info(`Compounding for farm ${farmBotConfig.name}`)
  const deadline = new BigNumber(Date.now())
    .dividedToIntegerBy(1000)
    .plus(deadlineSecondsAhead)
  const result = await farmBotContract.methods
    .compound(
      paths,
      minAmounts,
      minSwapOut,
      minLiquidity,
      deadline,
    )
    .send({
      from: compounderAddress,
      gas,
      gasPrice,
    })
  log.info(`tx result status: ${result.status}`)
}
