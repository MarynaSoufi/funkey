import { NextResponse } from 'next/server'
import { db } from '@/db'
import { activities, activityCategories, activityMedia } from '@/db/schema/schema'
import { eq } from 'drizzle-orm'
import { activitySchema } from '@/db/validation'

// GET /api/activities/:id
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

  const [activity] = await db.select().from(activities).where(eq(activities.id, id))
  if (!activity) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(activity)
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
