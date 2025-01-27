import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { loginRoute, registerRoute, userRoutes } from './routes/user-routes'

export const app = fastify()
app.register(cookie)

app.register(userRoutes, {
  prefix: 'users',
})
app.register(registerRoute, {
  prefix: 'register',
})
app.register(loginRoute, {
  prefix: 'login',
})
