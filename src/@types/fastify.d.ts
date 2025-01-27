// eslint-disable-next-line
import { FastifyInstance } from "fastify"

declare module 'fastify' {
  export interface FastifyRequest {
    user?: User
  }
}
