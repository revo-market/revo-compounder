import { ContractKit, newKit } from "@celo/contractkit";
import * as yargs from "yargs";
import { AbiItem } from "web3-utils";
import BigNumber from "bignumber.js";

const UBESWAP_FARM_BOT_ABI: AbiItem[] = require("../abis/UbeswapFarmBot.json");

interface Transaction {
  send: (sendParams: {
    from: string;
    gas: number;
    gasPrice: number;
  }) => Promise<{ status: boolean; gasUsed: number }>;
}

export interface FarmBotContract {
  methods: {
    compound: (
      paths: [string[], string[]][],
      minAmountsOut: [number, number][],
      deadline: BigNumber
    ) => Transaction;
  };
}

export async function getKit(
  privateKey: string,
  nodeURL: string
): Promise<{ kit: ContractKit; address: string }> {
  const kit = await newKit(nodeURL);
  const account = kit.web3.eth.accounts.privateKeyToAccount(privateKey);
  kit.web3.eth.accounts.wallet.add(account);
  kit.web3.eth.defaultAccount = account.address;
  console.log("Getting account with address " + account.address);
  return { kit, address: account.address };
}

export function getFarmBotContract(
  kit: ContractKit,
  abi: AbiItem[] | AbiItem,
  address: string
): FarmBotContract {
  return new kit.web3.eth.Contract(abi, address);
}

const UBESWAP_FARM_BOT_TYPE = "UbeswapFarmBot";

const FARM_BOT_TYPE_TO_ABI: Record<string, AbiItem[] | AbiItem> = {
  [UBESWAP_FARM_BOT_TYPE]: UBESWAP_FARM_BOT_ABI,
};

async function getPaths(
  _stakingTokens: [string, string],
  _rewardsTokens: string[]
): Promise<[string[], string[]][]> {
  // TODO make this dynamic
  const CELO_ADDRESS = "0x471EcE3750Da237f93B8E339c536989b8978a438";
  const mcUSD_ADDRESS = "0x918146359264c492bd6934071c6bd31c854edbc3";
  const mcEUR_ADDRESS = "0xe273ad7ee11dcfaa87383ad5977ee1504ac07568";
  const UBE_ADDRESS = "0x00be915b9dcf56a3cbe739d9b9c202ca692409ec";
  const MOO_ADDRESS = "0x17700282592d6917f6a73d0bf8accf4d578c131e";
  const mCELO_ADDRESS = "0x7D00cd74FF385c955EA3d79e47BF06bD7386387D";
  return [
    // from rewards token 0
    [
      // to staking token 0
      [CELO_ADDRESS, mcUSD_ADDRESS],
      // to staking token 1
      [CELO_ADDRESS, mcEUR_ADDRESS],
    ],
    // from rewards token 1
    [
      // to staking token 0
      [UBE_ADDRESS, CELO_ADDRESS, mcUSD_ADDRESS],
      // to staking token 1
      [UBE_ADDRESS, CELO_ADDRESS, mcEUR_ADDRESS],
    ],
    // from rewards token 2
    [
      // to staking token 0
      [MOO_ADDRESS, mCELO_ADDRESS, CELO_ADDRESS, mcUSD_ADDRESS],
      // to staking token 1
      [MOO_ADDRESS, mCELO_ADDRESS, CELO_ADDRESS, mcEUR_ADDRESS],
    ],
  ];
}

async function getMinAmounts(
  _paths: [string[], string[]][]
): Promise<[number, number][]> {
  // TODO get dynamically
  return [
    [0, 0],
    [0, 0],
    [0, 0],
  ];
}

export async function main() {
  const argv = await yargs
    .env("")
    .option("private-key", {
      description:
        "Private key to use for calling config. Must be authorized compounder for farm bot.",
      type: "string",
      demandOption: true,
    })
    .option("farm-bot-address", {
      description: "Address of farm bot to compound",
      type: "string",
      demandOption: true,
    })
    .option("node-url", {
      description: "URL for node to use for transaction",
      type: "string",
      demandOption: true,
      example: "https://alfajores-forno.celo-testnet.org",
    })
    .option("farm-bot-type", {
      description: "Type of farm bot",
      type: "string",
      choices: Object.keys(FARM_BOT_TYPE_TO_ABI),
      default: UBESWAP_FARM_BOT_TYPE,
    })
    .option("staking-tokens", {
      description: `Comma-separated addresses of the staking token in the pair of tokens in the farm bot's underlying liquidity pool`,
      type: "string",
      demandOption: true,
    })
    .option("rewards-tokens", {
      description: `Comma-separated addresses of the farm bot's rewards tokens, in order`,
      type: "string",
      demandOption: true,
    })
    .option("gas", {
      description: "Amount of gas to use",
      type: "number",
      default: 1100000,
    })
    .option("gas-price", {
      description: "Gas price",
      type: "number",
      default: 1000000000,
    })
    .option("deadline-seconds-ahead", {
      description:
        "How far ahead the deadline for the transaction should be, in seconds",
      type: "number",
      default: 300, // five min
    }).argv;
  // TODO add min profit arg and check rewards before calling compound

  const { kit, address: compounderAddress } = await getKit(
    argv.privateKey,
    argv.nodeUrl
  );
  const farmBotAbi = FARM_BOT_TYPE_TO_ABI[argv.farmBotType];
  const farmBotContract = getFarmBotContract(
    kit,
    farmBotAbi,
    argv.farmBotAddress
  );
  const paths = await getPaths(
    argv.stakingTokens.split(",") as [string, string],
    argv.rewardsTokens.split(",") as string[]
  );
  const minAmountsOut = await getMinAmounts(paths);
  const result = await farmBotContract.methods
    .compound(
      paths,
      minAmountsOut,
      new BigNumber(Date.now())
        .dividedToIntegerBy(1000)
        .plus(argv.deadlineSecondsAhead)
    )
    .send({
      from: compounderAddress,
      gas: argv.gas,
      gasPrice: argv.gasPrice,
    });
  console.log(`tx result status: ${result.status}`);
}

main().catch(console.error);
