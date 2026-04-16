import HeaderGuest from '@/components/HeaderGuest'

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <HeaderGuest />
      <main className="mx-auto w-full max-w-3xl px-4 py-8 flex-1">
        {children}
      </main>
    </>
  )
}
