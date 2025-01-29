import fastify from 'fastify'
import { loginRoute, registerRoute, usersRoutes } from './routes/users-routes'
import { mealsRoutes } from './routes/meals-routes'

export const app = fastify()
app.register(usersRoutes, {
  prefix: 'users',
})
app.register(registerRoute, {
  prefix: 'register',
})
app.register(loginRoute, {
  prefix: 'login',
})
app.register(mealsRoutes, {
  prefix: 'meals',
})
