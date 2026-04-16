import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST() {
  revalidateTag('posts', 'max')
  revalidateTag('tags', 'max')
  return NextResponse.json({ revalidated: true })
}
