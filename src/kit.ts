import { ContractKit, newKit } from "@celo/contractkit";

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
