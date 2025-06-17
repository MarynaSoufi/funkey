import useActivityFormController from '@/app/hooks/useActivityFormController'
import { Button } from './Button'
import { useEffect, useState } from 'react'
import { Activity, ActivitySubmitValues, Media } from '@/lib/types'

type Props = {
  onSubmit: (_values: ActivitySubmitValues) => void
  loading?: boolean
  activity: Activity
}

export default function UpdateActivityForm({ onSubmit, loading, activity }: Props) {
  const [allMedia, setAllMedia] = useState<Media[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useActivityFormController({
    title: activity.title,
    description: activity.description,
    media: activity?.media?.map((m) => ({
      id: m.id,
      title: m.title,
      link: m.link,
    })),
  })

  const selectedMedia = watch('media')

  // Fetch all media from the server
  useEffect(() => {
    fetch('/api/media')
      .then((res) => res.json())
      .then((data) => setAllMedia(data))
      .catch((err) => console.error('Failed to fetch media', err))
  }, [])

  // Handle checkbox toggle
  const toggleMedia = (media: Media) => {
    const isSelected = selectedMedia?.some((m) => m.id === media.id)

    const updated = isSelected
      ? selectedMedia?.filter((m) => m.id !== media.id)
      : [...(selectedMedia || []), media]

    setValue('media', updated, {
      shouldDirty: true,
      shouldValidate: true,
    })
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

      <Button disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
    </form>
  )
}
