import { FarmBotConfig, FarmBot, Config } from '../types'
import { UbeswapFarmBotClient } from '../clients/ubeswap-farm-bot-client'
import { ContractKit } from "@celo/contractkit";


const CELO_ADDRESS = '0x471EcE3750Da237f93B8E339c536989b8978a438';
const mcUSD_ADDRESS = '0x918146359264c492bd6934071c6bd31c854edbc3';
const mcEUR_ADDRESS = '0xe273ad7ee11dcfaa87383ad5977ee1504ac07568';
const UBE_ADDRESS = '0x00be915b9dcf56a3cbe739d9b9c202ca692409ec';
const MOO_ADDRESS = '0x17700282592d6917f6a73d0bf8accf4d578c131e';

const farmBotConfigs: FarmBotConfig[] = [
  {
    farmAddress: "0x2D886A6A0e6B1d3C3ee0bb4eEb6D5004E1Ed0946",
    name: "mcUSD-mcEUR",
    constructor: UbeswapFarmBotClient,
    paths: [
      [
	[CELO_ADDRESS, mcUSD_ADDRESS],
	[CELO_ADDRESS, mcEUR_ADDRESS],
      ],
      [
	[UBE_ADDRESS, CELO_ADDRESS, mcUSD_ADDRESS],
	[UBE_ADDRESS, CELO_ADDRESS, mcEUR_ADDRESS],
      ],
      [
	[MOO_ADDRESS, CELO_ADDRESS, mcUSD_ADDRESS],
	[MOO_ADDRESS, CELO_ADDRESS, mcEUR_ADDRESS],
      ]
    ],
    minAmountsOut: [
      [0,0],
      [0,0],
      [0,0],
    ]
  }
]

export async function getFarms(config: Config, kit: ContractKit): Promise<FarmBot[]> {
  return farmBotConfigs.map(farmBotConfig => new farmBotConfig.constructor(farmBotConfig, config, kit))
}
