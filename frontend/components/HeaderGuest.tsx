import Link from 'next/link'

export default function HeaderGuest() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-3xl px-4 py-4">
        <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-600">
          My blog
        </Link>
      </div>
    </header>
  )
}
