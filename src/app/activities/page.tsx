'use client'

import ActivityForm from '@/components/ActivityForm'
import { Button } from '@/components/Button'
import Modal from '@/components/Modal'
import PageContainer from '@/components/PageContainer'
import TableWrapper from '@/components/TableWarpper'
import { useEffect, useState } from 'react'

type Activity = {
  id: number
  title: string
  description: string
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  const fetchActivities = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/activities')
      if (!res.ok) throw new Error('Fetch activities error')
      const data = await res.json()
      setActivities(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [])

  const handleActivityCreate = async (data: any) => {
    setFormLoading(true)
    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Create activity error')

      const newActivity = await res.json()
      setActivities((prev) => [...prev, newActivity])
      fetchActivities()
      setIsModalOpen(false)
    } catch (e) {
      console.error(e)
    } finally {
      setFormLoading(false)
    }
  }

  const handleActivityDelete = async (id: number) => {
    const confirm = window.confirm('Are you sure you want to delete this activity?')
    if (!confirm) return

    try {
      const res = await fetch(`/api/activities/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Remove activity error')

      await fetchActivities()
    } catch (e: any) {
      alert(e.message)
    }
  }

  if (loading) return <div className="text-center py-10">Loading...</div>
  if (error)
    return <div className="text-center text-red-600 py-10">Fetch activities error: {error}</div>

  if (!activities.length)
    return <div className="text-center text-gray-500 py-10">No activities to display.</div>

  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Activities</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Activity</Button>
      </div>
      <TableWrapper data={activities} onRemove={handleActivityDelete} destination="activities" />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} disableClose={formLoading}>
        <ActivityForm onSubmit={handleActivityCreate} loading={formLoading} />
      </Modal>
    </PageContainer>
  )
}
