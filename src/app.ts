import fastify from 'fastify'
import { loginRoute, registerRoute, userRoutes } from './routes/user-routes'
import { mealsRoutes } from './routes/meals-routes'

export const app = fastify()
app.register(userRoutes, {
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
