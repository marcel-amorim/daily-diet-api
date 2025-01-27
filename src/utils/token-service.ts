import * as jwt from 'jsonwebtoken'
import { User } from '../models/user'
const accessTokenSalt = 'very-secret-salt'
const tokenExpiresIn = '1h'

async function generateToken(
  payload: object,
  salt: string,
  options: jwt.SignOptions,
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, salt, options, (err, token) => {
      if (err) {
        return reject(err)
      }
      resolve(token!)
    })
  })
}
async function verifyToken(
  token: string,
  salt: string,
): Promise<jwt.JwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, salt, undefined, (err, decoded) => {
      if (err) {
        return reject(err)
      }
      resolve(decoded as jwt.JwtPayload)
    })
  })
}

export function generateAccessToken(user: User): Promise<string> {
  return generateToken(user, accessTokenSalt, {
    expiresIn: tokenExpiresIn,
  })
}

export function verifyAccessToken(token: string): Promise<jwt.JwtPayload> {
  return verifyToken(token, accessTokenSalt)
}
