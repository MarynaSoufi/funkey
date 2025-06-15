import { NextResponse } from 'next/server'
import { db } from '@/db'
import { categories } from '@/db/schema/schema'
import { categorySchema } from '@/db/validation'

export async function GET() {
  try {
    const data = await db.select().from(categories)
    return NextResponse.json(data)
  } catch (error) {
    console.error('[GET /api/categories]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = categorySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
    }

    const [created] = await db.insert(categories).values(parsed.data).returning()
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
