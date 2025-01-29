import { execSync } from 'node:child_process'
import { afterAll, beforeAll, beforeEach } from 'vitest'

import { app } from './src/app'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

beforeEach(() => {
  execSync('npm run knex migrate:rollback --all')
  execSync('npm run knex migrate:latest')
})
