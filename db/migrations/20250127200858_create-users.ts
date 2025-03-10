import type { Knex } from 'knex'
import { uuidGeneration } from '../uuid-generation'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw(uuidGeneration))
    table.string('email').unique().notNullable()
    table.string('password').notNullable()
    table.string('name').notNullable()
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users')
}
