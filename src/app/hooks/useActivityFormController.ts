import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const createActivitySchema = z.object({
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
})

export type ActivityFormValues = z.infer<typeof createActivitySchema>

export default function useActivityFormController(initialValues?: Partial<ActivityFormValues>) {
  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(createActivitySchema),
    defaultValues: {
      title: '',
      description: '',
      media: [],
      ...initialValues,
    },
    mode: 'onChange',
  })

  return {
    ...form,
  }
}
