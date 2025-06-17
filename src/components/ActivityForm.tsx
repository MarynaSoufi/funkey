'use client'

import useActivityFormController from '@/app/hooks/useActivityFormController'
import { Button } from './Button'

type Props = {
  onSubmit: (data: any) => void
  loading?: boolean
}

export default function ActivityForm({ onSubmit, loading }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useActivityFormController()

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">Title</label>
        <input {...register('title')} className="w-full border px-3 py-2 rounded" />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Description</label>
        <textarea {...register('description')} className="w-full border px-3 py-2 rounded" />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      <Button disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
    </form>
  )
}
