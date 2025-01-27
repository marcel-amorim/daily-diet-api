import bcrypt from 'bcrypt'

export const createHash = async (data: string) => {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hash(data, salt)
}

export const compareHash = async (data: string, hash: string) => {
  return bcrypt.compare(data, hash)
}
