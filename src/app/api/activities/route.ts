// src/app/api/activities/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/db/index'
import { activities } from '@/db/schema/schema'
import { activitySchema } from '@/db/validation'

export async function GET() {
  try {
    const data = await db.select().from(activities)
    return NextResponse.json(data)
  } catch (error) {
    console.error('[GET /api/activities]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = activitySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
    }

    const created = await db.insert(activities).values(parsed.data).returning()
    return NextResponse.json(created[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
