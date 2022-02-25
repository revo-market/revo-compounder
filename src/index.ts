import log from './log'
import { loadConfig } from './config'
import { getFarms } from './farms'
import { getKit } from './kit'
import { setIntervalAsync } from 'set-interval-async/dynamic'
import { FarmBot, Config } from './types'

async function runFarmTask(farm: FarmBot, config: Config) {
  const farmName = await farm.getName()
  log.info(`Running compound task for ${farmName}`)
  await farm.runCompoundTask()
  log.info(`Compound task for ${farmName} complete, waiting ${config.compoundInterval} seconds...`)
}

async function main() {
  const config = loadConfig()
  const kit = await getKit(config.privateKey)
  const farms = await getFarms(config, kit)
  for await (const farm of farms) {
    // Call once at start since setInterval waits the initial duration
    runFarmTask(farm, config)

    setIntervalAsync(
      async () => { await runFarmTask(farm, config) },
      config.compoundInterval
    )
  }
}

main().catch((err) => {
  log.error(err)
  process.exit(1)
})
