export async function revalidatePosts() {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/api/revalidate`, {
    method: 'POST',
  })
}
