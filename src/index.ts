import { FARM_BOTS, NODE_URLS } from './constants'
import { getCompounderConfig } from './config'
import { compound } from './compound'
import { getKit } from './kit'
import { HttpFunction } from '@google-cloud/functions-framework/build/src/functions'

export const main: HttpFunction = async (_req, res) => {
  try {
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
    res.status(200).send({})
  } catch (e) {
    res.status(500).send({error: e})
  }
}
