import { ContractKit } from "@celo/contractkit";
import { FarmBotConfig, FarmBotContract } from "./types";
import log from "./log";
import BigNumber from "bignumber.js";
import { AbiItem } from "web3-utils";

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
  return pathsDefault;
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

export async function compound({
  kit,
  farmBotConfig,
  compounderAddress,
  gas,
  gasPrice,
  deadlineSecondsAhead,
}: {
  kit: ContractKit;
  farmBotConfig: FarmBotConfig;
  compounderAddress: string;
  gas: number;
  gasPrice: number;
  deadlineSecondsAhead: number;
}): Promise<void> {
  const farmBotContract = getFarmBotContract(
    kit,
    farmBotConfig.abi,
    farmBotConfig.farmAddress
  );
  const paths = await getPaths(farmBotConfig);
  const minAmountsOut = await getMinAmounts(paths);

  // TODO add min profit arg and check rewards before calling compound

  log.info(`Compounding for farm ${farmBotConfig.name}`);
  const result = await farmBotContract.methods
    .compound(
      paths,
      minAmountsOut,
      new BigNumber(Date.now())
        .dividedToIntegerBy(1000)
        .plus(deadlineSecondsAhead)
    )
    .send({
      from: compounderAddress,
      gas,
      gasPrice,
    });
  log.info(`tx result status: ${result.status}`);

  // todo deposit compounder rewards back in farm bot
}
