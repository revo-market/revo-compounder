import BigNumber from 'bignumber.js'
import { AbiItem } from 'web3-utils'

interface Transaction {
  send: (sendParams: {
    from: string
    gas: number
    gasPrice: number
  }) => Promise<{ status: boolean; gasUsed: number }>
}

export interface UbeswapFarmBotContract {
  methods: {
    deposit: (amount: string) => Transaction
    withdraw: (amount: string) => Transaction
    compound: (
      paths: [string[], string[]][],
      minAmountsOut: [number, number][],
      deadline: BigNumber,
    ) => Transaction
  }
}

export interface MobiusFarmBotContract {
  methods: {
    compound: (
      paths: string[][],
      minAmountsOut: BigNumber[],
      minSwapOut: BigNumber,
      minLiquidity: BigNumber,
      deadline: BigNumber,
    ) => Transaction
  }
}

export type Address = string

export type Network = 'ALFAJORES' | 'MAINNET'

export function isNetwork(network: string): network is Network {
  return network === 'MAINNET' || network === 'ALFAJORES'
}

export interface UbeswapFarmBotConfig {
  farmAddress: Address
  name: string
  network: Network
  farmBotType: 'UBESWAP'
  stakingTokens: [Address, Address]
  rewardsTokens: Address[]
  abi: AbiItem[] | AbiItem
  pathsDefault: [string[], string[]][]
}

export interface MobiusFarmBotConfig {
  farmAddress: Address
  name: string
  network: Network
  farmBotType: 'MOBIUS'
  celoStakingToken: Address // celo-native member of the pair, e.g. cUSD in cUSD-cUSDC
  bridgeStakingToken: Address // non-native member, e.g. cUSDC in cUSD-cUSDC
  rewardsTokens: Address[]
  abi: AbiItem[] | AbiItem
  pathsDefault: Address[][] // inner lists are path from a rewards token to celoStakingToken
}

export type FarmBotConfig = UbeswapFarmBotConfig | MobiusFarmBotConfig

export interface CompounderConfig {
  privateKey: string
  network: Network
  farmBotNames: string[]
  deadlineSecondsAhead: number
  gas: number
  gasPrice: number
}
