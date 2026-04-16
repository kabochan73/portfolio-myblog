import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST() {
  revalidateTag('posts')
  revalidateTag('tags')
  return NextResponse.json({ revalidated: true })
}
