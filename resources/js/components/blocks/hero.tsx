import { Link } from '@inertiajs/react';
import { ArrowRight, CircleArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { booking } from '@/routes';

export default function HeroSection() {
    return (
        <section className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-10 px-4 md:flex-row md:gap-12">
            <div className="flex flex-1 flex-col items-center gap-6 md:items-start">
                <Badge variant="outline" className="h-auto px-3 py-1 text-xs">
                    A quieter kind of luxury
                </Badge>

                <h1 className="max-w-xl text-center font-serif text-6xl leading-[0.95] tracking-tight text-primary md:text-start lg:text-8xl">
                    Moments worth staying for.
                </h1>

                <p className="max-w-md text-center text-base leading-relaxed text-muted-foreground md:text-start">
                    Discover thoughtfully designed rooms, warm hospitality, and
                    a stay where comfort meets timeless elegance.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                    <Button asChild variant="outline">
                        <a href="#rooms">
                            <CircleArrowRight />
                            Explore our rooms
                        </a>
                    </Button>
                    <Button asChild>
                        <Link href={booking.url()}>
                            Book now
                            <ArrowRight />
                        </Link>
                    </Button>
                </div>

                <div className="mt-2 flex items-center gap-6 text-sm text-muted-foreground">
                    <span>
                        <strong className="text-foreground">3</strong> room
                        types
                    </span>
                    <span className="h-4 w-px bg-border" />
                    <span>
                        <strong className="text-foreground">24/7</strong>{' '}
                        concierge
                    </span>
                    <span className="h-4 w-px bg-border" />
                    <span>
                        <strong className="text-foreground">4.9</strong> guest
                        rating
                    </span>
                </div>
            </div>

            <div className="w-full flex-1 overflow-hidden rounded-3xl">
                <img
                    src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1400&auto=format&fit=crop"
                    alt="Hotela lobby suite"
                    className="h-[420px] w-full bg-muted object-cover md:h-[560px]"
                />
            </div>
        </section>
    );
}
