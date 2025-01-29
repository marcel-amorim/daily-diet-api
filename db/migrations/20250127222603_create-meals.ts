import type { Knex } from 'knex'
import { uuidGeneration } from '../uuid-generation'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw(uuidGeneration))
    table.string('name').notNullable()
    table.string('description').notNullable()
    table.timestamp('date_time').notNullable()
    table.boolean('is_planned').notNullable()
    table
      .uuid('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .notNullable()
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('meals')
}
