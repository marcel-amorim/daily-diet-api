import { config } from 'dotenv'
import { z } from 'zod'

config({ path: [`.env.${process.env.NODE_ENV}`, '.env'] })

const envSchema = z.object({
  NODE_ENV: z.string(),
  DATABASE_CLIENT: z.enum(['pg', 'sqlite']),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.log('🚨🚨🚨 Invalid env variables!\n', _env.error.format())
  throw new Error('Invalid env variables')
}

export const env = _env.data
