import { FastifyRequest, FastifyReply } from 'fastify'
import { verifyAccessToken } from '../utils/token-service'

export async function accessMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { authorization } = request.headers
  if (!authorization) {
    return reply.code(401).send({ error: 'No authorization provided' })
  }
  const token = authorization.split(' ')[1]
  if (!token) {
    return reply.code(401).send({ error: 'No token provided' })
  }
  try {
    const decoded = await verifyAccessToken(token)
    request.user = decoded
  } catch (err) {
    return reply.code(401).send({ error: 'No token provided' })
  }
}
