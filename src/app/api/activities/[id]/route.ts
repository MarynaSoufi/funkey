import { NextResponse } from 'next/server'
import { db } from '@/db'
import { activities, activityCategories, activityMedia, media } from '@/db/schema/schema'
import { eq } from 'drizzle-orm'
import { activitySchema } from '@/db/validation'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)

  if (isNaN(id) || id <= 0) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  try {
    const rows = await db
      .select({
        activityId: activities.id,
        activityTitle: activities.title,
        activityDescription: activities.description,
        mediaId: media.id,
        mediaTitle: media.title,
        mediaLink: media.link,
      })
      .from(activities)
      .leftJoin(activityMedia, eq(activities.id, activityMedia.activityId))
      .leftJoin(media, eq(activityMedia.mediaId, media.id))
      .where(eq(activities.id, id))

    if (!rows.length) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 })
    }

    const { activityId, activityTitle, activityDescription } = rows[0]

    const mediaList = rows
      .filter((row) => row.mediaId !== null)
      .map((row) => ({
        id: row.mediaId!,
        title: row.mediaTitle!,
        link: row.mediaLink!,
      }))

    const fullActivity = {
      id: activityId,
      title: activityTitle,
      description: activityDescription,
      media: mediaList,
    }

    return NextResponse.json(fullActivity)
  } catch (error) {
    console.error('Failed to fetch activity:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// PATCH /api/activities/:id
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

  const body = await req.json()
  const parsed = activitySchema.partial().safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })

  const [updated] = await db
    .update(activities)
    .set(parsed.data)
    .where(eq(activities.id, id))
    .returning()
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(updated)
}

// DELETE /api/activities/:id
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

  await db.delete(activityCategories).where(eq(activityCategories.activityId, id))
  await db.delete(activityMedia).where(eq(activityMedia.activityId, id))

  const [deleted] = await db.delete(activities).where(eq(activities.id, id)).returning()
  if (!deleted) return NextResponse.json({ message: 'Not found' }, { status: 404 })

  return NextResponse.json(deleted)
}
