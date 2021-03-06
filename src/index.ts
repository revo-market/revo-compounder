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
    let responseStatus = 200
    const responseBody: Record<string, any> = {}
    for (const farmBotName of farmBotNames) {
      try {
        const farmBotConfig = FARM_BOTS[network][farmBotName]
        await compound({
          kit,
          farmBotConfig,
          compounderAddress,
          gas,
          gasPrice,
          deadlineSecondsAhead,
        })
      } catch (e) {
        // still try other farms, but return a 500 at the end
        console.error(`Error compounding ${farmBotName}: ${e}`)
        responseStatus = 500
        responseBody.errors = responseBody.errors ? [...responseBody.errors, e] : [e]
      }
    }
    res.status(responseStatus).send(responseBody)
  } catch (e) {
    res.status(500).send({error: e})
  }
}
