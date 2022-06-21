import { AbiItem } from 'web3-utils'
import { UbeswapFarmBotConfig, Network, MobiusFarmBotConfig, FarmBotConfig } from './types'

const ADDRESSES = {
  MAINNET: {
    CELO: '0x471EcE3750Da237f93B8E339c536989b8978a438',
    mcUSD: '0x918146359264c492bd6934071c6bd31c854edbc3',
    mcEUR: '0xe273ad7ee11dcfaa87383ad5977ee1504ac07568',
    UBE: '0x00be915b9dcf56a3cbe739d9b9c202ca692409ec',
    MOO: '0x17700282592d6917f6a73d0bf8accf4d578c131e',
    MOBI: '0x73a210637f6F6B7005512677Ba6B3C96bb4AA44B',
    PACT: '0x46c9757C5497c5B1f2eb73aE79b6B67D119B0B58',
    cUSD: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
    USDC: '0xef4229c8c3250C675F21BCefa42f58EfbfF6002a',
    mcUSD_mcEUR_FARM_BOT: '0xCB34fbfC3b9a73bc04D2eb43B62532c7918d9E81',
    PACT_CELO_FARM_BOT: '0xec17fb85529a6a48cb6ed7e3c1d1a7cc57d742c1',
    UBE_CELO_FARM_BOT: '0x1cEC3e5722CB0a2FFB78e299b9607ea7efA92090',
    CELO_mcUSD_FARM_BOT: '0xC2402ADc740eFdC40C19fc384240481f11E35E8a',
    cUSD_USDC_FARM_BOT: '0x61e6b1C8AB35dcb7FE1B86f14D52A5A5820Be5d4',
  },
}

export const NODE_URLS = {
  ALFAJORES: 'https://alfajores-forno.celo-testnet.org',
  MAINNET: 'https://forno.celo.org',
}

const UBESWAP_FARM_BOT_ABI: AbiItem[] = require('../abis/RevoUbeswapFarmBot.json')
const UBESWAP_SINGLE_REWARD_FARM_BOT_ABI: AbiItem[] = require('../abis/RevoUbeswapSingleRewardFarmBot.json')
const MOBIUS_FARM_BOT_ABI: AbiItem[] = require('../abis/RevoMobiusFarmBot.json')

const mcUSD_mcEUR_FARM_BOT_MAINNET: UbeswapFarmBotConfig = {
  name: 'mcUSD-mcEUR-ubeswap',
  abi: UBESWAP_FARM_BOT_ABI,
  network: 'MAINNET',
  farmBotType: 'UBESWAP',
  farmAddress: ADDRESSES.MAINNET.mcUSD_mcEUR_FARM_BOT,
  stakingTokens: [ADDRESSES.MAINNET.mcUSD, ADDRESSES.MAINNET.mcEUR],
  rewardsTokens: [
    ADDRESSES.MAINNET.CELO,
    ADDRESSES.MAINNET.UBE,
    ADDRESSES.MAINNET.MOO,
  ],
  pathsDefault: [
    // from rewards token 0
    [
      // to staking token 0
      [ADDRESSES.MAINNET.CELO, ADDRESSES.MAINNET.mcUSD],
      // to staking token 1
      [ADDRESSES.MAINNET.CELO, ADDRESSES.MAINNET.mcEUR],
    ],
    // from rewards token 1
    [
      // to staking token 0
      [ADDRESSES.MAINNET.UBE, ADDRESSES.MAINNET.CELO, ADDRESSES.MAINNET.mcUSD],
      // to staking token 1
      [ADDRESSES.MAINNET.UBE, ADDRESSES.MAINNET.CELO, ADDRESSES.MAINNET.mcEUR],
    ],
    // from rewards token 2
    [
      // to staking token 0
      [ADDRESSES.MAINNET.MOO, ADDRESSES.MAINNET.CELO, ADDRESSES.MAINNET.mcUSD],
      // to staking token 1
      [ADDRESSES.MAINNET.MOO, ADDRESSES.MAINNET.CELO, ADDRESSES.MAINNET.mcEUR],
    ],
  ],
}

const PACT_CELO_MAINNET: UbeswapFarmBotConfig = {
  name: 'PACT-CELO-ubeswap',
  abi: UBESWAP_FARM_BOT_ABI,
  farmBotType: 'UBESWAP',
  network: 'MAINNET',
  farmAddress: ADDRESSES.MAINNET.PACT_CELO_FARM_BOT,
  stakingTokens: [ADDRESSES.MAINNET.PACT, ADDRESSES.MAINNET.CELO],
  rewardsTokens: [
    ADDRESSES.MAINNET.PACT,
    ADDRESSES.MAINNET.CELO,
    ADDRESSES.MAINNET.UBE,
  ],
  pathsDefault: [
    // from rewards token 0
    [
      // to staking token 0
      [ADDRESSES.MAINNET.PACT],
      // to staking token 1
      [ADDRESSES.MAINNET.PACT, ADDRESSES.MAINNET.CELO],
    ],
    // from rewards token 1
    [
      // to staking token 0
      [ADDRESSES.MAINNET.CELO, ADDRESSES.MAINNET.PACT],
      // to staking token 1
      [ADDRESSES.MAINNET.CELO],
    ],
    // from rewards token 2
    [
      // to staking token 0
      [ADDRESSES.MAINNET.UBE, ADDRESSES.MAINNET.CELO, ADDRESSES.MAINNET.PACT],
      // to staking token 1
      [ADDRESSES.MAINNET.UBE, ADDRESSES.MAINNET.CELO],
    ],
  ],
}

const UBE_CELO_MAINNET: UbeswapFarmBotConfig = {
  name: 'UBE-CELO-ubeswap',
  abi: UBESWAP_SINGLE_REWARD_FARM_BOT_ABI,
  network: 'MAINNET',
  farmBotType: 'UBESWAP',
  farmAddress: ADDRESSES.MAINNET.UBE_CELO_FARM_BOT,
  stakingTokens: [ADDRESSES.MAINNET.UBE, ADDRESSES.MAINNET.CELO],
  rewardsTokens: [
    ADDRESSES.MAINNET.UBE,
  ],
  pathsDefault: [
    // from rewards token 0
    [
      // to staking token 0
      [ADDRESSES.MAINNET.UBE],
      // to staking token 1
      [ADDRESSES.MAINNET.UBE, ADDRESSES.MAINNET.CELO],
    ],
  ],
}

const CELO_mcUSD_MAINNET: UbeswapFarmBotConfig = {
  name: 'CELO-mcUSD-ubeswap',
  abi: UBESWAP_SINGLE_REWARD_FARM_BOT_ABI,
  network: 'MAINNET',
  farmBotType: 'UBESWAP',
  farmAddress: ADDRESSES.MAINNET.CELO_mcUSD_FARM_BOT,
  stakingTokens: [ADDRESSES.MAINNET.CELO, ADDRESSES.MAINNET.mcUSD],
  rewardsTokens: [
    ADDRESSES.MAINNET.UBE,
  ],
  pathsDefault: [
    // from rewards token 0
    [
      // to staking token 0
      [ADDRESSES.MAINNET.UBE, ADDRESSES.MAINNET.CELO],
      // to staking token 1
      [ADDRESSES.MAINNET.UBE, ADDRESSES.MAINNET.CELO, ADDRESSES.MAINNET.mcUSD],
    ],
  ],
}

const cUSD_USDC_MAINNET: MobiusFarmBotConfig = {
  name: 'cUSD-USDC-mobius',
  abi: MOBIUS_FARM_BOT_ABI,
  farmBotType: 'MOBIUS',
  network: 'MAINNET',
  farmAddress: ADDRESSES.MAINNET.cUSD_USDC_FARM_BOT,
  celoStakingToken: ADDRESSES.MAINNET.cUSD,
  bridgeStakingToken: ADDRESSES.MAINNET.USDC,
  rewardsTokens: [ADDRESSES.MAINNET.MOBI, ADDRESSES.MAINNET.CELO],
  pathsDefault: [[ADDRESSES.MAINNET.MOBI, ADDRESSES.MAINNET.CELO, ADDRESSES.MAINNET.cUSD], [ADDRESSES.MAINNET.CELO, ADDRESSES.MAINNET.cUSD]]
}

export const FARM_BOTS: Record<Network, Record<string, FarmBotConfig>> = {
  MAINNET: {
    [mcUSD_mcEUR_FARM_BOT_MAINNET.name]: mcUSD_mcEUR_FARM_BOT_MAINNET,
    [PACT_CELO_MAINNET.name]: PACT_CELO_MAINNET,
    [UBE_CELO_MAINNET.name]: UBE_CELO_MAINNET,
    [CELO_mcUSD_MAINNET.name]: CELO_mcUSD_MAINNET,
    [cUSD_USDC_MAINNET.name]: cUSD_USDC_MAINNET,
  },
  ALFAJORES: {},
}
