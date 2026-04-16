export async function revalidatePosts() {
  await fetch('/api/revalidate', {
    method: 'POST',
  })
}
