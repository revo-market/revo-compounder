import BigNumber from "bignumber.js";
import { AbiItem } from "web3-utils";

interface Transaction {
  send: (sendParams: {
    from: string;
    gas: number;
    gasPrice: number;
  }) => Promise<{ status: boolean; gasUsed: number }>;
}

export interface FarmBotContract {
  methods: {
    deposit: (amount: string) => Transaction;
    withdraw: (amount: string) => Transaction;
    compound: (
      paths: [string[], string[]][],
      minAmountsOut: [number, number][],
      deadline: BigNumber
    ) => Transaction;
  };
}

export type Address = string;

export type Network = "ALFAJORES" | "MAINNET";

export function isNetwork(network: string): network is Network {
  return network === "MAINNET" || network === "ALFAJORES";
}

export interface FarmBotConfig {
  farmAddress: Address;
  name: string;
  network: Network;
  stakingTokens: [Address, Address];
  rewardsTokens: Address[];
  abi: AbiItem[] | AbiItem;
  pathsDefault: [string[], string[]][];
}

export interface CompounderConfig {
  privateKey: string;
  network: Network;
  farmBotNames: string[];
  deadlineSecondsAhead: number;
  gas: number;
  gasPrice: number;
}
