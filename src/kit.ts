import {ContractKit, newKit} from "@celo/contractkit";

const FORNO_MAINNET_URL = 'https://forno.celo.org'

export async function getKit(privateKey: string): Promise<ContractKit> {
  const kit = await newKit(FORNO_MAINNET_URL)
  const account = kit.web3.eth.accounts.privateKeyToAccount(privateKey)
  kit.web3.eth.accounts.wallet.add(account)
  kit.web3.eth.defaultAccount = account.address
  return kit
}
