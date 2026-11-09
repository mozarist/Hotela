const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#about", label: "About" },
    { href: "/rooms", label: "Rooms" },
    { href: "/#testimonials", label: "Testimonials" },
    { href: "/#faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
];

export function Footer() {
    return (
        <footer className="mx-auto max-w-7xl w-full px-4">
            <div className="flex flex-col sm:flex-row gap-6 sm:justify-between sm:items-center py-6">
                <h5 className="text-2xl text-primary font-medium">
                    Hotela
                </h5>
                <nav>
                    <ul className="grid sm:flex grid-cols-2 sm:grid-cols-none gap-3 md:gap-6 font-medium text-muted-foreground text-sm">
                        {navLinks.map((link) => (
                            <li key={link.label}>
                                <a className="hover:text-foreground" href={link.href}>
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t py-4 text-muted-foreground text-sm">
                <p>&copy; {new Date().getFullYear()} Hotela. All rights reserved.</p>

                <p className="inline-flex items-center gap-1">
                    <span>Built by</span>
                    <a
                        aria-label="Visit arist.dev website"
                        className="inline-flex items-center gap-1 text-foreground/80 hover:text-foreground hover:underline"
                        href={"https://mozarist.my.id"}
                        rel="noreferrer"
                        target="_blank"
                    >
                        mozarist.dev
                    </a>
                </p>
            </div>
        </footer>
    );
}