import { NextResponse } from 'next/server'
import { db } from '@/db'
import { activityMedia } from '@/db/schema/schema'
import { z } from 'zod'
import { and, eq } from 'drizzle-orm'

const schema = z.object({
  activityId: z.number(),
  mediaId: z.number(),
})

export async function GET() {
  try {
    const result = await db.select().from(activityMedia)
    return NextResponse.json(result)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch activity-media relationships' },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })

    const [created] = await db.insert(activityMedia).values(parsed.data).returning()
    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to create activity-media relationship' },
      { status: 500 },
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })

    const { activityId, mediaId } = parsed.data
    const [deleted] = await db
      .delete(activityMedia)
      .where(and(eq(activityMedia.activityId, activityId), eq(activityMedia.mediaId, mediaId)))
      .returning()

    return NextResponse.json(deleted ?? { message: 'Not found' }, { status: deleted ? 200 : 404 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete activity-media relationship' },
      { status: 500 },
    )
  }
}
