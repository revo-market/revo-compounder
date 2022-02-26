import { AbiItem } from 'web3-utils'
import { FarmBotConfig, Network } from './types'

const ADDRESSES = {
  MAINNET: {
    CELO: '0x471EcE3750Da237f93B8E339c536989b8978a438',
    mcUSD: '0x918146359264c492bd6934071c6bd31c854edbc3',
    mcEUR: '0xe273ad7ee11dcfaa87383ad5977ee1504ac07568',
    UBE: '0x00be915b9dcf56a3cbe739d9b9c202ca692409ec',
    MOO: '0x17700282592d6917f6a73d0bf8accf4d578c131e',
    mCELO: '0x7D00cd74FF385c955EA3d79e47BF06bD7386387D',
    mcUSD_mcEUR_FARM_BOT: '0x37a1BBCbb2554392859AF7b52967dDA9ACA9Daf8',
  },
}

export const NODE_URLS = {
  ALFAJORES: 'https://alfajores-forno.celo-testnet.org',
  MAINNET: 'https://forno.celo.org',
}

const UBESWAP_FARM_BOT_ABI: AbiItem[] = require('../abis/UbeswapFarmBot.json')

const mcUSD_mcEUR_FARM_BOT_MAINNET: FarmBotConfig = {
  name: 'mcUSD-mcEUR-ubeswap',
  abi: UBESWAP_FARM_BOT_ABI,
  network: 'MAINNET',
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
      [
        ADDRESSES.MAINNET.MOO,
        ADDRESSES.MAINNET.mCELO,
        ADDRESSES.MAINNET.CELO,
        ADDRESSES.MAINNET.mcUSD,
      ],
      // to staking token 1
      [
        ADDRESSES.MAINNET.MOO,
        ADDRESSES.MAINNET.mCELO,
        ADDRESSES.MAINNET.CELO,
        ADDRESSES.MAINNET.mcEUR,
      ],
    ],
  ],
}

export const FARM_BOTS: Record<Network, Record<string, FarmBotConfig>> = {
  MAINNET: {
    [mcUSD_mcEUR_FARM_BOT_MAINNET.name]: mcUSD_mcEUR_FARM_BOT_MAINNET,
  },
  ALFAJORES: {},
}
