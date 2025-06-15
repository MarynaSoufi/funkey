import { z } from 'zod'

// ✅ Activity validation
export const activitySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  categoryIds: z.array(z.number().int()).optional(),
  mediaIds: z.array(z.number().int()).optional(),
})

export type ActivityInput = z.infer<typeof activitySchema>

// ✅ Category validation
export const categorySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  activityIds: z.array(z.number().int()).optional(),
  mediaIds: z.array(z.number().int()).optional(),
})

export type CategoryInput = z.infer<typeof categorySchema>

// ✅ Media validation
export const mediaSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  link: z.string().url('Must be a valid URL'),
})

export type MediaInput = z.infer<typeof mediaSchema>
