'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import UpdateActivityForm from '@/components/UpdateActivityForm'

type Media = { id: number; title: string; link: string }
type Activity = { id: number; title: string; description: string; media: Media[] }

export default function ActivityDetailPage() {
  const { id } = useParams()
  const [activity, setActivity] = useState<Activity | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      if (!id) {
        setError('Invalid activity ID')
        setLoading(false)
        return
      }
      try {
        const [activityRes] = await Promise.all([fetch(`/api/activities/${id}`)])

        if (!activityRes.ok) throw new Error('Failed to fetch activity')

        const activityData = await activityRes.json()

        setActivity(activityData)
      } catch (e: any) {
        setError(e.message || 'Error loading data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  const handleSave = async (values: {
    title: string
    description: string
    media: { id: number; title: string; link: string }[]
  }) => {
    setSaving(true)

    try {
      // 1. Update activity title and description
      const res = await fetch(`/api/activities/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: values.title,
          description: values.description,
        }),
      })

      if (!res.ok) throw new Error('Failed to update activity')
      const updated = await res.json()

      // 2. Compare old and new media
      const prevIds = new Set(activity?.media.map((m) => m.id))
      const newIds = new Set(values.media.map((m) => m.id))

      const toAdd = [...newIds].filter((id) => !prevIds.has(id))
      const toRemove = [...prevIds].filter((id) => !newIds.has(id))

      // 3. Add new media
      await Promise.all(
        toAdd.map((mediaId) =>
          fetch('/api/activity-media', {
            method: 'POST',
            body: JSON.stringify({
              activityId: Number(id),
              mediaId,
            }),
          }),
        ),
      )

      // 4. Remove old media
      await Promise.all(
        toRemove.map((mediaId) =>
          fetch('/api/activity-media', {
            method: 'DELETE',
            body: JSON.stringify({
              activityId: Number(id),
              mediaId,
            }),
          }),
        ),
      )

      // 5. Update local state
      setActivity({
        ...updated,
        media: values.media,
      })
    } catch (error) {
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-center py-10">Loading...</div>
  if (error || !activity) return <div className="text-red-600 text-center py-10">{error}</div>

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Activity Detail</h1>
      <UpdateActivityForm onSubmit={handleSave} loading={saving} activity={activity} />
    </div>
  )
}
