import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const createCategorySchema = z.object({
  title: z.string().min(1, 'Mandatory field'),
  description: z.string().min(1, 'Mandatory field'),
  media: z
    .array(
      z.object({
        id: z.number(),
        title: z.string(),
        link: z.string().url(),
      }),
    )
    .optional(),
  activity: z
    .array(
      z.object({
        id: z.number(),
        title: z.string(),
        description: z.string(),
      }),
    )
    .optional(),
})

export type CategoryFormValues = z.infer<typeof createCategorySchema>

export default function useCategoryFormController(initialValues?: Partial<CategoryFormValues>) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      title: '',
      description: '',
      media: [],
      activity: [],
      ...initialValues,
    },
    mode: 'onChange',
  })

  return {
    ...form,
  }
}
