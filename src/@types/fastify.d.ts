// eslint-disable-next-line
import { FastifyInstance } from "fastify"
import { User } from '../models/user'

declare module 'fastify' {
  export interface FastifyRequest {
    user?: User
  }
}
