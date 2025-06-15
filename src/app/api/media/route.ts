import { NextResponse } from 'next/server'
import { db } from '@/db'
import { media } from '@/db/schema/schema'
import { mediaSchema } from '@/db/validation'

export async function GET() {
  try {
    const all = await db.select().from(media)
    return NextResponse.json(all)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const parsed = mediaSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
    }

    const [created] = await db.insert(media).values(parsed.data).returning()
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create media' }, { status: 500 })
  }
}
