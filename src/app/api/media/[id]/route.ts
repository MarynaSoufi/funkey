import { NextResponse } from 'next/server'
import { db } from '@/db'
import { media } from '@/db/schema/schema'
import { eq } from 'drizzle-orm'
import { mediaSchema } from '@/db/validation'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id)
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

    const [item] = await db.select().from(media).where(eq(media.id, id))
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id)
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

    const json = await req.json()
    const parsed = mediaSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
    }

    const [updated] = await db.update(media).set(parsed.data).where(eq(media.id, id)).returning()
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating media:', error)
    return NextResponse.json({ error: 'Failed to update media' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id)
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

    const [deleted] = await db.delete(media).where(eq(media.id, id)).returning()
    return NextResponse.json(deleted ?? { message: 'Not found' }, { status: deleted ? 200 : 404 })
  } catch (error) {
    console.error('Error deleting media:', error)
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 })
  }
}
