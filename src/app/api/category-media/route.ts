import { NextResponse } from 'next/server'
import { db } from '@/db'
import { categoryMedia } from '@/db/schema/schema'
import { z } from 'zod'
import { and, eq } from 'drizzle-orm'

const schema = z.object({
  categoryId: z.number(),
  mediaId: z.number(),
})

export async function GET() {
  try {
    const result = await db.select().from(categoryMedia)
    return NextResponse.json(result)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch category-media relationships' },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })

    const [created] = await db.insert(categoryMedia).values(parsed.data).returning()
    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to create category-media relationship' },
      { status: 500 },
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })

    const { categoryId, mediaId } = parsed.data
    const [deleted] = await db
      .delete(categoryMedia)
      .where(and(eq(categoryMedia.mediaId, mediaId), eq(categoryMedia.categoryId, categoryId)))
      .returning()

    return NextResponse.json(deleted ?? { message: 'Not found' }, { status: deleted ? 200 : 404 })
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete category-media relationship' },
      { status: 500 },
    )
  }
}
