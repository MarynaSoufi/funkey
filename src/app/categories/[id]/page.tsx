'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Category, CategorySubmitValues } from '@/lib/types'
import UpdateCategoryForm from '@/components/UpdateCategoryForm'

export default function CategoryDetailPage() {
  const { id } = useParams()
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      if (!id) {
        setError('Invalid category ID')
        setLoading(false)
        return
      }
      try {
        const res = await fetch(`/api/categories/${id}`)
        if (!res.ok) throw new Error('Failed to fetch category')

        const categoryData = await res.json()
        setCategory(categoryData)
      } catch (e: any) {
        setError(e.message || 'Error loading data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  const handleSave = async (values: CategorySubmitValues) => {
    setSaving(true)

    try {
      // 1. Update category title and description
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: values.title,
          description: values.description,
        }),
      })

      if (!res.ok) throw new Error('Failed to update category')
      const updated = await res.json()

      // --- Media ---

      const prevMediaIds = new Set(category?.media?.map((m) => m.id))
      const newMediaIds = new Set(values?.media?.map((m) => m.id))

      const mediaToAdd = [...newMediaIds].filter((id) => !prevMediaIds.has(id))
      const mediaToRemove = [...prevMediaIds].filter((id) => !newMediaIds.has(id))

      await Promise.all([
        ...mediaToAdd.map((mediaId) =>
          fetch('/api/category-media', {
            method: 'POST',
            body: JSON.stringify({ categoryId: Number(id), mediaId }),
          }),
        ),
        ...mediaToRemove.map((mediaId) =>
          fetch('/api/category-media', {
            method: 'DELETE',
            body: JSON.stringify({ categoryId: Number(id), mediaId }),
          }),
        ),
      ])

      // --- Activities ---

      const prevActivityIds = new Set(category?.activity?.map((a) => a.id))
      const newActivityIds = new Set(values?.activity?.map((a) => a.id))

      const activitiesToAdd = [...newActivityIds].filter((id) => !prevActivityIds.has(id))
      const activitiesToRemove = [...prevActivityIds].filter((id) => !newActivityIds.has(id))

      await Promise.all([
        ...activitiesToAdd.map((activityId) =>
          fetch('/api/activity-categories', {
            method: 'POST',
            body: JSON.stringify({ categoryId: Number(id), activityId }),
          }),
        ),
        ...activitiesToRemove.map((activityId) =>
          fetch('/api/activity-categories', {
            method: 'DELETE',
            body: JSON.stringify({ categoryId: Number(id), activityId }),
          }),
        ),
      ])

      // Update local state with the new category data
      setCategory({
        ...updated,
        media: values.media,
        activity: values.activity,
      })
    } catch (error) {
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-center py-10">Loading...</div>
  if (error || !category) return <div className="text-red-600 text-center py-10">{error}</div>
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Category Detail</h1>
      <UpdateCategoryForm onSubmit={handleSave} loading={saving} category={category} />
    </div>
  )
}
