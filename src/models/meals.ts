import { z } from 'zod'

export const mealSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  date_time: z.date({ coerce: true }),
  is_planned: z.coerce.boolean(),
  user_id: z.string().uuid(),
})

export type Meal = z.infer<typeof mealSchema>

export const mealCreateSchema = mealSchema.omit({ id: true, user_id: true })

export type MealCreate = z.infer<typeof mealCreateSchema>

export type MealUpdate = Omit<Partial<MealCreate>, 'date_time'> & {
  date_time?: string
}

export const mealUpdateSchema = z
  .object({
    name: z.string().optional(),
    description: z.string().optional(),
    date_time: z.date({ coerce: true }).optional(),
    is_planned: z.boolean().optional(),
  })
  .transform((data) => {
    const obj: MealUpdate = {}
    if (data.name) {
      obj.name = data.name
    }
    if (data.description) {
      obj.description = data.description
    }
    if (data.date_time) {
      obj.date_time = data.date_time.toISOString()
    }
    if (data.is_planned != null) {
      obj.is_planned = data.is_planned
    }

    return obj
  })

export type MealUpdateObject = Omit<MealUpdate, 'date_time'> & {
  date_time?: string
}

export const mealListSchema = z.array(mealSchema)
