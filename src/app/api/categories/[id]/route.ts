import { NextResponse } from 'next/server'
import { db } from '@/db'
import {
  activities,
  activityCategories,
  categories,
  categoryMedia,
  media,
} from '@/db/schema/schema'
import { categorySchema } from '@/db/validation'
import { eq } from 'drizzle-orm'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)

  if (isNaN(id) || id <= 0) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  try {
    const categoryRows = await db
      .select({
        categoryId: categories.id,
        categoryTitle: categories.title,
        categoryDescription: categories.description,
        activityId: activities.id,
        activityTitle: activities.title,
        activityDescription: activities.description,
      })
      .from(categories)
      .leftJoin(activityCategories, eq(categories.id, activityCategories.categoryId))
      .leftJoin(activities, eq(activityCategories.activityId, activities.id))
      .where(eq(categories.id, id))

    if (!categoryRows.length) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    const { categoryId, categoryTitle, categoryDescription } = categoryRows[0]

    const activitiesList = categoryRows
      .filter((row) => row.activityId !== null)
      .map((row) => ({
        id: row.activityId!,
        title: row.activityTitle!,
        description: row.activityDescription!,
      }))

    // 2. Get all media associated with this category
    const mediaRows = await db
      .select({
        mediaId: media.id,
        mediaTitle: media.title,
        mediaLink: media.link,
      })
      .from(categoryMedia)
      .leftJoin(media, eq(categoryMedia.mediaId, media.id))
      .where(eq(categoryMedia.categoryId, id))

    const mediaList = mediaRows.map((m) => ({
      id: m.mediaId,
      title: m.mediaTitle,
      link: m.mediaLink,
    }))

    const fullCategory = {
      id: categoryId,
      title: categoryTitle,
      description: categoryDescription,
      activity: activitiesList,
      media: mediaList,
    }

    return NextResponse.json(fullCategory)
  } catch (error) {
    console.error('Failed to fetch category:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
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

    // 1. Remove all activity-category relationships
    await db.delete(activityCategories).where(eq(activityCategories.categoryId, id))

    // 2. Remove all media associated with this category
    await db.delete(categoryMedia).where(eq(categoryMedia.categoryId, id))

    // 3. Remove the category itself
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
