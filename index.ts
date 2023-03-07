import { fastify } from "fastify"
import fsAsync from 'fs/promises'
import { IronfishSdk } from "@ironfish/sdk"
import { FromSchema } from "json-schema-to-ts"

const requestSchema = {
    type: 'object',
    required: ['route'],
    properties: {
      route: { type: 'string' },
      data: { type: 'object' },
    },
} as const

const schema = { body: requestSchema }

const start = async () => {
  const server = fastify({ logger: true })
  const config = JSON.parse((await fsAsync.readFile('.ironfish.config.json')).toString())
  const sdk = await IronfishSdk.init(config) 

  server.post<{ Body: FromSchema<typeof requestSchema> }>('/test', { schema }, async (request, reply) => {
    const client = await sdk.connectRpc(false, true)

    const response = await client.request(request.body.route, request.body.data).waitForEnd()

    return reply.send(response.content)
  })

  try {
    server.listen({ port: 8080 })
  } catch (e) {
    server.log.error(e)
    process.exit(1)
  }
}

start()
