import {main} from "../index"
import {Request, Response} from '@google-cloud/functions-framework'

const mockReq = {} as unknown as Request // unused
const mockRes = {} as unknown as Response
mockRes.status = (code: number) => {
  console.log(`mock response code: ${code}`)
  return mockRes
}
mockRes.send = (body: Object) => {
  console.log(`mock response body: ${JSON.stringify(body)}`)
  return mockRes
}

main(mockReq, mockRes)
  .then(() => {
    console.log('done')
    process.exit(0)
  })
  .catch((err: any) => {
    console.error(JSON.stringify(err))
    process.exit(1)
  })
