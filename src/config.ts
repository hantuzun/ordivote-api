import { z } from 'zod'

const ServerConfig = z.object({
  DATABASE_URL: z.string().url(),
})

let serverConfig: z.infer<typeof ServerConfig>

serverConfig = ServerConfig.parse({
  DATABASE_URL: process.env.DATABASE_URL!,
})

export { serverConfig }
