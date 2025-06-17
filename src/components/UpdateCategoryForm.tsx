'use client'

import { useEffect, useState } from 'react'
import { Button } from './Button'
import useCategoryFormController from '@/app/hooks/useCategoryFormController'
import { Activity, Category, CategorySubmitValues, Media } from '@/lib/types'

type Props = {
  onSubmit: (_values: CategorySubmitValues) => void
  loading?: boolean
  category: Category
}

export default function UpdateCategoryForm({ onSubmit, loading, category }: Props) {
  const [allMedia, setAllMedia] = useState<Media[]>([])
  const [allActivities, setAllActivities] = useState<Activity[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useCategoryFormController({
    title: category.title,
    description: category.description,
    media: category.media,
    activity: category.activity,
  })

  const selectedMedia = watch('media')
  const selectedActivities = watch('activity')

  // Fetch all media
  useEffect(() => {
    fetch('/api/media')
      .then((res) => res.json())
      .then((data) => setAllMedia(data))
      .catch((err) => console.error('Failed to fetch media', err))
  }, [])

  // Fetch all activities
  useEffect(() => {
    fetch('/api/activities')
      .then((res) => res.json())
      .then((data) => setAllActivities(data))
      .catch((err) => console.error('Failed to fetch activities', err))
  }, [])

  const toggleMedia = (media: Media) => {
    const isSelected = selectedMedia?.some((m) => m.id === media.id)
    const updated = isSelected
      ? selectedMedia?.filter((m) => m.id !== media.id)
      : [...(selectedMedia || []), media]

    setValue('media', updated, { shouldDirty: true, shouldValidate: true })
  }

  const toggleActivity = (activity: Activity) => {
    const isSelected = selectedActivities?.some((a) => a.id === activity.id)
    const updated = isSelected
      ? selectedActivities?.filter((a) => a.id !== activity.id)
      : [...(selectedActivities || []), activity]

    setValue('activity', updated, { shouldDirty: true, shouldValidate: true })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block mb-1 font-medium">Title</label>
        <input
          {...register('title')}
          className="w-full border px-3 py-2 rounded"
          disabled={loading}
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Description</label>
        <textarea
          {...register('description')}
          className="w-full border px-3 py-2 rounded"
          disabled={loading}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium mb-2">Media</label>
        <div className="space-y-2">
          {allMedia.map((media) => (
            <label key={media.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!selectedMedia?.some((m) => m.id === media.id)}
                onChange={() => toggleMedia(media)}
                disabled={loading}
              />
              <span>{media.title}</span>
            </label>
          ))}
        </div>
        {errors.media && (
          <p className="text-red-500 text-sm mt-1">{(errors.media as any)?.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium mb-2">Activities</label>
        <div className="space-y-2">
          {allActivities.map((activity) => (
            <label key={activity.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!selectedActivities?.some((a) => a.id === activity.id)}
                onChange={() => toggleActivity(activity)}
                disabled={loading}
              />
              <span>{activity.title}</span>
            </label>
          ))}
        </div>
        {errors.activity && (
          <p className="text-red-500 text-sm mt-1">{(errors.activity as any)?.message}</p>
        )}
      </div>

      <Button disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
    </form>
  )
}
