import { describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../app'
import { UserRegister } from '../models/user'

describe('User routes', () => {
  const user: UserRegister = {
    email: 'marcel@amorim.live',
    password: '123456',
    name: 'Marcel Amorim',
  }

  const createUser = async (newFields?: Partial<UserRegister>) => {
    return await request(app.server)
      .post('/register')
      .send({ ...user, ...newFields })
  }

  const loginUser = async () => {
    return await request(app.server)
      .post('/login')
      .send({ email: user.email, password: user.password })
  }

  it('should create a new user', async () => {
    const response = await createUser()
    expect(response.status).toBe(201)
  })

  it('should login', async () => {
    await createUser()
    const response = await loginUser()
    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      accessToken: expect.any(String),
    })
  })

  it('should get user info', async () => {
    await createUser()
    const loginResponse = await loginUser()
    const response = await request(app.server)
      .get('/users/me')
      .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
    expect(response.status).toBe(200)
    expect(response.body.user).toMatchObject({
      id: expect.any(String),
      email: user.email,
      name: user.name,
    })
  })

  it('should list all users', async () => {
    await createUser()
    await createUser({ email: 'marcel_amorim@live.com' })
    const loginResponse = await loginUser()
    const response = await request(app.server)
      .get('/users')
      .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
    expect(response.status).toBe(200)
    expect(response.body.users).toHaveLength(2)
  })
})
