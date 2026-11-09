import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, LayoutDashboard } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { booking, home, login } from '@/routes';

export default function NavBar() {
    const { auth } = usePage().props;

    return (
        <>
            <div className="h-16"></div>

            <nav className="fixed top-0 z-50 w-full border-b bg-background/90 backdrop-blur">
                <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
                    <Link href={home.url()} className="flex-1">
                        <AppLogo />
                    </Link>

                    <div className="hidden flex-2 items-center justify-center gap-6 text-base font-medium md:flex">
                        <Link
                            href={home.url()}
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Home
                        </Link>
                        <a
                            href="/#rooms"
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Rooms
                        </a>
                        <a
                            href="/#services"
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Services
                        </a>
                        <Link
                            href={booking.url()}
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Booking
                        </Link>
                    </div>

                    <div className="flex flex-1 items-center justify-end gap-2">
                        {auth?.user ? (
                            <Button asChild variant="outline">
                                <Link href="/dashboard">
                                    <LayoutDashboard />
                                    Dashboard
                                </Link>
                            </Button>
                        ) : (
                            <Button asChild variant="ghost">
                                <Link href={login.url()}>Sign in</Link>
                            </Button>
                        )}
                        <Button
                            asChild
                            size="sm"
                            className="hidden sm:inline-flex"
                        >
                            <Link href={booking.url()}>
                                Book a room
                                <ArrowRight />
                            </Link>
                        </Button>
                    </div>
                </div>
            </nav>
        </>
    );
}
