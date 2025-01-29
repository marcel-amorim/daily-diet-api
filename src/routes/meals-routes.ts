import { FastifyInstance } from 'fastify'
import { accessMiddleware } from '../middlewares/access-middleware'
import {
  Meal,
  mealCreateSchema,
  mealListSchema,
  mealSchema,
  mealUpdateSchema,
} from '../models/meals'
import { knex } from '../database'
import { idParamsSchema } from '../models/shared'

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', accessMiddleware)

  app.post('/', async (request, reply) => {
    const { name, description, date_time, is_planned } = mealCreateSchema.parse(
      request.body,
    )

    await knex('meals').insert({
      name,
      description,
      date_time: date_time.toISOString(),
      is_planned,
      user_id: request.user!.id,
    })

    return reply.code(201).send()
  })

  app.put('/:id', async (request, reply) => {
    const params = idParamsSchema.parse(request.params)

    const mealDb = await knex<Meal>('meals').where({ id: params.id }).first()
    if (!mealDb) {
      return reply.code(404).send({ error: 'Meal not found' })
    }

    const meal = mealSchema.parse(mealDb)

    if (meal.user_id !== request.user!.id) {
      return reply.code(403).send({ error: 'Forbidden' })
    }

    const updateData = mealUpdateSchema.parse(request.body)

    await knex('meals').where({ id: params.id }).update(updateData)

    return reply.code(200).send()
  })

  app.delete('/:id', async (request, reply) => {
    const params = idParamsSchema.parse(request.params)

    const mealDb = await knex<Meal>('meals').where({ id: params.id }).first()
    if (!mealDb) {
      return reply.code(404).send({ error: 'Meal not found' })
    }

    const meal = mealSchema.parse(mealDb)

    if (meal.user_id !== request.user!.id) {
      return reply.code(403).send({ error: 'Forbidden' })
    }

    await knex('meals').where({ id: params.id }).delete()

    return reply.code(200).send()
  })

  app.get('/', async (request) => {
    const mealsDb = await knex('meals')
      .where({ user_id: request.user!.id })
      .select('*')

    const meals = mealListSchema.parse(mealsDb)

    return { meals }
  })

  app.get('/:id', async (request, reply) => {
    const params = idParamsSchema.parse(request.params)

    const mealDb = await knex('meals').where({ id: params.id }).first()
    if (!mealDb) {
      return reply.code(404).send({ error: 'Meal not found' })
    }

    const meal = mealSchema.parse(mealDb)

    if (meal.user_id !== request.user!.id) {
      return reply.code(403).send({ error: 'Forbidden' })
    }

    return { meal }
  })

  app.get('/metrics', async (request) => {
    const mealsDb = await knex('meals')
      .where({ user_id: request.user!.id })
      .select('*')

    const meals = mealListSchema.parse(mealsDb)

    let planned = 0
    let unplanned = 0
    let maxSequence = 0
    let sequence = 0

    for (const meal of meals) {
      if (meal.is_planned) {
        planned++
        sequence++
      } else {
        maxSequence = Math.max(maxSequence, sequence)
        sequence = 0
        unplanned++
      }
    }

    maxSequence = Math.max(maxSequence, sequence)

    return {
      metrics: { total: planned + unplanned, planned, unplanned, maxSequence },
    }
  })
}
