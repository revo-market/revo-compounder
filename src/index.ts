import { ContractKit, newKit } from "@celo/contractkit";
import { FARM_BOTS, NODE_URLS } from "./constants";
import log from "./log";
import { getCompounderConfig } from "./config";
import { compound } from "./compound";

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

export async function main() {
  // TODO add min profit arg and check rewards before calling compound
  const {
    privateKey,
    gas,
    gasPrice,
    deadlineSecondsAhead,
    network,
    farmBotNames,
  } = await getCompounderConfig();
  const { kit, address: compounderAddress } = await getKit(
    privateKey,
    NODE_URLS[network]
  );

  for (const farmBotName of farmBotNames) {
    const farmBotConfig = FARM_BOTS[network][farmBotName];
    await compound({
      kit,
      farmBotConfig,
      compounderAddress,
      gas,
      gasPrice,
      deadlineSecondsAhead,
    });
  }
}

main().catch(log.error);
