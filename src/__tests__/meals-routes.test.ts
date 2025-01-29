import { describe, expect, expect, it, it } from 'vitest'
import request from 'supertest'
import { UserRegister } from '../models/user'
import { app } from '../app'
import { MealCreate, mealListSchema, mealSchema } from '../models/meals'
import console from 'console'

describe('Meals routes', () => {
  const loginUser = async () => {
    const user: UserRegister = {
      email: 'marcel@amorim.live',
      password: '123456',
      name: 'Marcel Amorim',
    }

    await request(app.server).post('/register').send(user)

    const response = await request(app.server)
      .post('/login')
      .send({ email: user.email, password: user.password })

    return response.body.accessToken
  }

  const meal: MealCreate = {
    name: 'Almoço',
    description: 'Feijoada completa',
    is_planned: true,
    date_time: new Date(),
  }

  const createMeal = (accessToken: string, data?: Partial<MealCreate>) =>
    request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ ...meal, ...data })

  const listMeals = (accessToken: string) =>
    request(app.server)
      .get('/meals')
      .set('Authorization', `Bearer ${accessToken}`)

  it('should create a new meal', async () => {
    const token = await loginUser()

    const response = await createMeal(token)
    expect(response.status).toBe(201)
  })

  it('should list meals', async () => {
    const token = await loginUser()
    await createMeal(token)
    const response = await listMeals(token)

    const meals = mealListSchema.parse(response.body.meals)

    expect(meals).toEqual(
      expect.arrayContaining([expect.objectContaining(meal)]),
    )
  })

  it('should update a meal', async () => {
    const token = await loginUser()
    await createMeal(token)

    const response = await listMeals(token)
    const mealId = response.body.meals[0].id

    const updatedMeal = {
      name: 'Jantar',
      description: 'Pizza',
      is_planned: false,
      date_time: new Date().toISOString(),
    }

    const updateResponse = await request(app.server)
      .put(`/meals/${mealId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedMeal)

    expect(updateResponse.status).toBe(200)

    const newList = await listMeals(token)

    expect(newList.body.meals).toEqual(
      expect.arrayContaining([expect.objectContaining(updatedMeal)]),
    )
  })

  it('should delete a meal', async () => {
    const token = await loginUser()
    await createMeal(token)

    const response = await listMeals(token)
    const mealId = response.body.meals[0].id

    const deleteResponse = await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(deleteResponse.status).toBe(200)

    const newList = await listMeals(token)

    expect(newList.body.meals).toHaveLength(0)
  })

  it('should get a meal by id', async () => {
    const token = await loginUser()
    await createMeal(token)

    const response = await listMeals(token)
    const mealId = response.body.meals[0].id

    const getResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Authorization', `Bearer ${token}`)

    const mealDb = mealSchema.parse(getResponse.body.meal)

    expect(getResponse.status).toBe(200)
    expect(mealDb).toEqual(expect.objectContaining(meal))
  })

  it('should get metrics', async () => {
    const token = await loginUser()
    await createMeal(token)
    await createMeal(token, { is_planned: false })

    const response = await request(app.server)
      .get('/meals/metrics')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.metrics).toEqual({
      total: 2,
      planned: 1,
      unplanned: 1,
      maxSequence: 1,
    })
  })
})
