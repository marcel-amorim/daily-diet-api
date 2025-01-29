import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { compareHash, createHash } from '../utils/crypto'
import { userListSchema, userSchema } from '../models/user'
import { generateAccessToken } from '../utils/token-service'
import { accessMiddleware } from '../middlewares/access-middleware'

export async function usersRoutes(app: FastifyInstance) {
  app.addHook('preHandler', accessMiddleware)

  app.get('/', async () => {
    const usersDb = await knex('users').select('*')
    const users = userListSchema.parse(usersDb)

    return { users }
  })

  app.get('/me', async (request, reply) => {
    const userDb = await knex('users')
      .where({ id: request.user?.id })
      .select('*')
      .first()
    if (!userDb) {
      return reply.code(404).send({ error: 'User not found' })
    }

    const user = userSchema.parse(userDb)

    return { user }
  })
}

export async function registerRoute(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const { email, password, name } = z
      .object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string(),
      })
      .parse(request.body)

    const hashedPassword = await createHash(password)

    await knex('users').insert({
      email,
      password: hashedPassword,
      name,
    })

    return reply.code(201).send()
  })
}

export async function loginRoute(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const { email, password } = z
      .object({
        email: z.string().email(),
        password: z.string().min(6),
      })
      .parse(request.body)

    const userDb = await knex('users')
      .where({
        email,
      })
      .select('*')
      .first()

    if (!userDb || !(await compareHash(password, userDb.password))) {
      return reply.code(401).send({ error: 'Invalid email or password' })
    }

    const user = userSchema.parse(userDb)
    const accessToken = await generateAccessToken(user)
    return reply.send({ accessToken })
  })
}
