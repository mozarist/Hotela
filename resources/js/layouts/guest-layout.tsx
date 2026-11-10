import { Footer } from '@/components/blocks/footer'
import NavBar from '@/components/blocks/navbar'

export default function GuestLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col gap-16">
            <NavBar />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    )
}