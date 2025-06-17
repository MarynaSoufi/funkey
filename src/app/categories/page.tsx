'use client'

import ActivityForm from '@/components/ActivityForm'
import { Button } from '@/components/Button'
import Modal from '@/components/Modal'
import PageContainer from '@/components/PageContainer'
import TableWrapper from '@/components/TableWarpper'
import { Category } from '@/lib/types'
import { useEffect, useState } from 'react'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/categories')
      if (!res.ok) throw new Error('Fetch categories error')
      const data = await res.json()
      setCategories(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleCategoryCreate = async (data: any) => {
    setFormLoading(true)
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Create category error')

      const newCategory = await res.json()
      setCategories((prev) => [...prev, newCategory])
      fetchCategories()
      setIsModalOpen(false)
    } catch (e) {
      console.error(e)
    } finally {
      setFormLoading(false)
    }
  }

  const handleCategoryDelete = async (id: number) => {
    const confirm = window.confirm('Are you sure you want to delete this category?')
    if (!confirm) return

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Remove category error')

      await fetchCategories()
    } catch (e: any) {
      alert(e.message)
    }
  }

  if (loading) return <div className="text-center py-10">Loading...</div>
  if (error)
    return <div className="text-center text-red-600 py-10">Fetch categories error: {error}</div>

  if (!categories.length)
    return <div className="text-center text-gray-500 py-10">No categories to display.</div>

  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Category</Button>
      </div>
      <TableWrapper data={categories} onRemove={handleCategoryDelete} destination="categories" />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} disableClose={formLoading}>
        <ActivityForm onSubmit={handleCategoryCreate} loading={formLoading} />
      </Modal>
    </PageContainer>
  )
}
