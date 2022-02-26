import { FARM_BOTS, NODE_URLS } from './constants'
import { getCompounderConfig } from './config'
import { compound } from './compound'
import { getKit } from './kit'

export async function main() {
  const {
    privateKey,
    gas,
    gasPrice,
    deadlineSecondsAhead,
    network,
    farmBotNames,
  } = await getCompounderConfig()
  const { kit, address: compounderAddress } = await getKit(
    privateKey,
    NODE_URLS[network],
  )

  for (const farmBotName of farmBotNames) {
    const farmBotConfig = FARM_BOTS[network][farmBotName]
    await compound({
      kit,
      farmBotConfig,
      compounderAddress,
      gas,
      gasPrice,
      deadlineSecondsAhead,
    })
  }
}
