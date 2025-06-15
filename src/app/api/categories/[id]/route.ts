import { NextResponse } from 'next/server'
import { db } from '@/db'
import { categories } from '@/db/schema/schema'
import { categorySchema } from '@/db/validation'
import { eq } from 'drizzle-orm'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const [category] = await db.select().from(categories).where(eq(categories.id, id))
    if (!category) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const body = await req.json()
    const parsed = categorySchema.partial().safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
    }

    const [updated] = await db
      .update(categories)
      .set(parsed.data)
      .where(eq(categories.id, id))
      .returning()

    if (!updated) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const [deleted] = await db.delete(categories).where(eq(categories.id, id)).returning()

    if (!deleted) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(deleted)
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
