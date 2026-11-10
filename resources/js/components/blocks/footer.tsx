import { Link } from '@inertiajs/react';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { booking, home } from '@/routes';

const exploreLinks = [
    { href: `${home.url()}#about`, label: 'About Hotela' },
    { href: `${home.url()}#services`, label: 'Our services' },
    { href: `${home.url()}#rooms`, label: 'Explore rooms' },
    { href: `${home.url()}#faq`, label: 'Guest FAQ' },
];

export function Footer() {
    return (
        <footer className="w-full print:hidden">
            <div className="mx-auto max-w-7xl px-4 pb-8">
                <div className="rounded-3xl bg-[url(https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D)] overflow-hidden">
                    <div className="flex flex-col justify-between gap-8 bg-linear-to-r from-foreground/80 to-foreground/25 px-6 py-10 text-primary-foreground md:px-10 md:py-14">
                        <div className="max-w-xl text-balance">
                            <h2 className="mt-4 font-serif text-4xl leading-tight tracking-tight md:text-6xl">
                                Let's make your stay unforgettable.
                            </h2>
                        </div>
                        <Link
                            href={booking.url()}
                            className="group inline-flex shrink-0 items-center gap-3 text-sm font-medium"
                        >
                            Book your stay
                            <span className="flex size-10 items-center justify-center rounded-full border border-primary-foreground/40 transition-colors group-hover:bg-primary-foreground group-hover:text-primary">
                                <ArrowUpRight className="size-4" />
                            </span>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="border-t border-border">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr] md:py-16">
                    <div className="max-w-xs">
                        <Link href={home.url()} aria-label="Hotela home">
                            <AppLogo />
                        </Link>
                        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                            A warm, thoughtful stay in Bogor, designed for slow
                            mornings, restful nights, and meaningful moments.
                        </p>
                    </div>

                    <div>
                        <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                            Explore
                        </p>
                        <nav className="mt-5 flex flex-col items-start gap-3 text-sm">
                            {exploreLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="transition-colors hover:text-primary"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </nav>
                    </div>

                    <div>
                        <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                            Get in touch
                        </p>
                        <div className="mt-5 flex flex-col gap-3 text-sm text-muted-foreground">
                            <a
                                href="https://wa.me/6281383415432"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-3 transition-colors hover:text-foreground"
                            >
                                <Phone className="size-4" />
                                0813-8341-5432
                            </a>
                            <a
                                href="mailto:hotela@gmail.com"
                                className="inline-flex items-center gap-3 transition-colors hover:text-foreground"
                            >
                                <Mail className="size-4" />
                                hotela@gmail.com
                            </a>
                            <span className="inline-flex items-start gap-3">
                                <MapPin className="mt-0.5 size-4 shrink-0" />
                                <span>
                                    Jl. Poras No.07, Bogor
                                    <br />
                                    Jawa Barat 16117
                                </span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mx-auto flex max-w-7xl flex-col gap-3 border-t px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        &copy; {new Date().getFullYear()} Hotela. All rights
                        reserved.
                    </p>
                    <p>Thoughtfully made for better stays.</p>
                </div>
            </div>
        </footer>
    );
}
