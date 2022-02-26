import { ContractKit, newKit } from "@celo/contractkit";
import * as yargs from "yargs";
import { AbiItem } from "web3-utils";
import BigNumber from "bignumber.js";
import {FarmBotContract, Network} from "./types";
import {FARM_BOTS, NODE_URLS} from "./constants";
import log from "./log";

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

async function getPaths({
  pathsDefault,
}: {
  stakingTokens: [string, string];
  rewardsTokens: string[];
  pathsDefault: [string[], string[]][];
}): Promise<[string[], string[]][]> {
  // TODO make this dynamic
  return pathsDefault
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

function isNetwork(network: string): network is Network {
  return network === 'MAINNET' || network === 'ALFAJORES'
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
    .option("gas", {
      description: "Amount of gas to use",
      type: "number",
      default: 3000000,
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
    })
    .option("network", {
      description: "Network to use",
      type: "string",
      choices: ["ALFAJORES", "MAINNET"],
      default: "MAINNET",
    })
    .option("farm-bot-names", {
      description: "Comma-separated names of farm bots to compound for",
      type: "string",
      example: "mcUSD-mcEUR-ubeswap",
      demandOption: true,
    }).argv;
  // TODO add min profit arg and check rewards before calling compound

  if (!isNetwork(argv.network)){
    throw new Error('Invalid network name: ' + argv.network)
  }

  const { kit, address: compounderAddress } = await getKit(
    argv.privateKey,
    NODE_URLS[argv.network]
  )

  const farmBotNames = argv.farmBotNames.split(',')
  for (const farmBotName of farmBotNames) {
    const farmBotConfig = FARM_BOTS[argv.network][farmBotName]
    const farmBotContract = getFarmBotContract(
      kit,
      farmBotConfig.abi,
      farmBotConfig.farmAddress
    )
    const paths = await getPaths(farmBotConfig)
    const minAmountsOut = await getMinAmounts(paths)
    log.info(`Compounding for farm ${farmBotConfig.name}`)
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
    log.info(`tx result status: ${result.status}`);
  }
}

main().catch(console.error);
