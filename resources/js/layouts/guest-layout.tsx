import { Footer } from '@/components/blocks/footer'
import NavBar from '@/components/blocks/navbar'

export default function GuestLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <NavBar />
            <main className="flex-1">{children}</main>
            <Footer />
        </>
    )
}