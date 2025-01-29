// eslint-disable-next-line
import { Knex } from "knex";

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      email: string
      password: string
      name: string
      created_at: Date
      updated_at: Date
    }
    meals: {
      id: string
      name: string
      description: string
      date_time: string
      is_planned: boolean
      user_id: string
      created_at: Date
      updated_at: Date
    }
  }
}
