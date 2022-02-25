//import { BigNumber } from 'bignumber.js'

export type Address = string

export interface Config {
  compoundInterval: number
  privateKey: string
  gas: number
  gasPrice: number
}

export interface FarmBot {
  getPaths(): Promise<Address[][][]>
  getName(): Promise<string>
  getMinAmountsOut(): Promise<number[][]>
  runCompoundTask(): Promise<void>
  compound(paths: Address[][][], minAmountsOut: number[][], deadline: number): Promise<void>
}


export interface FarmBotConfig {
  farmAddress: Address
  name: string
  paths?: Address[][][], // These are optional fields for farms where we want to temporarily hardcode this information
  minAmountsOut?: number[][]
  constructor: new(...args: any[]) => FarmBot
}

export interface Transaction {
  send: (sendParams: {
    from: string
    gas: number
    gasPrice: number
  }) => Promise<{status: boolean, gasUsed: number}>
}

export interface FarmBotContract {
  methods: {
    deposit: (amount: string) => Transaction
    withdraw: (amount: string) => Transaction
    compound: (paths: Address[][][], minAmountsOut: number[][], deadline: number) => Transaction
  }
}
