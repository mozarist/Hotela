import { Head } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import Contact from '@/components/blocks/contact';
import FeaturedRooms from '@/components/blocks/featured-rooms';
import HeroSection from '@/components/blocks/hero';
import OurServices from '@/components/blocks/services';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { RoomType } from '@/types/hotel';

const testimonials = [
    {
        quote: 'A stay that made us forget to check the time.',
        description:
            'Everything felt beautifully considered. The room, the breakfast, and the calm atmosphere made every moment feel effortless.',
        name: 'Amelia Morgan',
        location: 'London, United Kingdom',
        initials: 'AM',
    },
    {
        quote: 'The kind of comfort you remember long after leaving.',
        description:
            'From the warm welcome to the quiet morning coffee, every detail made our weekend feel wonderfully unhurried.',
        name: 'Rafael Santos',
        location: 'Lisbon, Portugal',
        initials: 'RS',
    },
    {
        quote: 'A beautiful pause from the pace of everyday life.',
        description:
            'The room was serene, the service was thoughtful, and the whole hotel had a feeling of understated luxury.',
        name: 'Nadia Pratama',
        location: 'Jakarta, Indonesia',
        initials: 'NP',
    },
];

export default function Welcome({ roomTypes }: { roomTypes: RoomType[] }) {
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const testimonial = testimonials[activeTestimonial];

    useEffect(() => {
        const autoplay = window.setInterval(() => {
            setActiveTestimonial(
                (current) => (current + 1) % testimonials.length,
            );
        }, 5000);

        return () => window.clearInterval(autoplay);
    }, []);

    function showTestimonial(index: number) {
        setActiveTestimonial(
            (index + testimonials.length) % testimonials.length,
        );
    }

    return (
        <>
            <Head title="Find the best stay" />

            <div className="relative -mt-16 flex w-full flex-col items-center gap-24 overflow-hidden">
                <HeroSection />

                {/* About Section */}
                <div
                    id="about"
                    className="flex w-full max-w-7xl flex-col items-center justify-center gap-4 px-4 md:flex-row md:justify-between"
                >
                    <p className="flex-1 text-xl font-medium xl:text-2xl">
                        We are a boutique hotel that offers a unique and
                        personalized experience for our guests. Our rooms are
                        designed with comfort and style in mind, and our staff
                        is dedicated to providing exceptional service. Whether
                        you're here for business or leisure, we strive to make
                        your stay memorable.
                    </p>

                    <div className="flex w-full flex-1 justify-center divide-x divide-border text-center md:justify-end">
                        <div className="flex flex-col items-center justify-center gap-2 px-6 py-4">
                            <span className="font-serif text-4xl md:text-5xl">
                                14+ Years
                            </span>
                            <span className="text-sm text-muted-foreground">
                                of Experience
                            </span>
                        </div>

                        <div className="flex flex-col items-center justify-center gap-2 px-6 py-4">
                            <span className="font-serif text-4xl md:text-5xl">
                                4.9
                            </span>
                            <span className="text-sm text-muted-foreground">
                                Star Rating
                            </span>
                        </div>

                        <div className="flex flex-col items-center justify-center gap-2 px-6 py-4">
                            <span className="font-serif text-4xl md:text-5xl">
                                100%
                            </span>
                            <span className="text-sm text-muted-foreground">
                                Guest Satisfaction
                            </span>
                        </div>
                    </div>
                </div>

                <OurServices />

                {/* mini gallery */}
                <div className="-gap-4 grid w-full max-w-7xl justify-center px-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="aspect-square w-full rotate-3 overflow-hidden rounded-3xl border-6 border-background bg-muted">
                        <img
                            src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
                            alt="Room 1"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="aspect-square w-full -rotate-3 overflow-hidden rounded-3xl border-6 border-background bg-muted">
                        <img
                            src="https://images.unsplash.com/photo-1758380388614-66e9fd1aa159?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
                            alt="Room 3"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="aspect-square w-full rotate-3 overflow-hidden rounded-3xl border-6 border-background bg-muted">
                        <img
                            src="https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
                            alt="Room 3"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="aspect-square w-full -rotate-3 overflow-hidden rounded-3xl border-6 border-background bg-muted">
                        <img
                            src="https://images.unsplash.com/photo-1549294413-26f195200c16?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
                            alt="Room 2"
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>

                <FeaturedRooms roomTypes={roomTypes} />

                {/* Testimonials Section */}
                <section
                    className="w-full max-w-7xl px-4"
                    aria-labelledby="testimonials-title"
                    onKeyDown={(event) => {
                        if (event.key === 'ArrowLeft') {
                            showTestimonial(activeTestimonial - 1);
                        }

                        if (event.key === 'ArrowRight') {
                            showTestimonial(activeTestimonial + 1);
                        }
                    }}
                    tabIndex={0}
                >
                    <Card className="rounded-3xl border-0 bg-muted/50 py-8 shadow-none ring-0 min-h-120 flex justify-center">
                        <CardContent className="grid gap-10 px-6 md:grid-cols-[minmax(180px,0.35fr)_1fr] md:px-12 lg:gap-20">
                            <div className="flex flex-col justify-between gap-8">
                                <div>
                                    <p className="font-serif text-3xl capitalize">
                                        What our guests{' '}
                                        <span className="italic">say</span>
                                    </p>
                                    <div
                                        className="mt-8 flex items-center gap-1"
                                        aria-label="5 out of 5 stars"
                                    >
                                        {Array.from({ length: 5 }).map(
                                            (_, index) => (
                                                <Star
                                                    key={index}
                                                    className="size-4 fill-current text-yellow-400"
                                                    aria-hidden="true"
                                                />
                                            ),
                                        )}
                                    </div>
                                    <h2
                                        id="testimonials-title"
                                        className="mt-3 font-serif text-5xl tracking-tight md:text-6xl"
                                    >
                                        4.9 / 5
                                    </h2>
                                    <p className="mt-3 max-w-48 text-sm leading-relaxed text-muted-foreground">
                                        Average rating from more than 600 guest
                                        reviews
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col justify-center gap-8">
                                <div>
                                    <span
                                        className="font-serif text-8xl leading-none text-muted-foreground"
                                        aria-hidden="true"
                                    >
                                        “
                                    </span>
                                    <blockquote
                                        className="mt-2 max-w-3xl font-serif text-3xl leading-tight tracking-tight md:text-4xl"
                                        aria-live="polite"
                                    >
                                        {testimonial.quote}
                                    </blockquote>
                                    <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                                        {testimonial.description}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 border-t border-border pt-6">
                                    <Avatar size="lg">
                                        <AvatarFallback className="bg-primary text-primary-foreground">
                                            {testimonial.initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">
                                            {testimonial.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {testimonial.location}
                                        </p>
                                    </div>
                                    <div className="ml-auto flex items-center gap-3">
                                        <span className="font-serif text-2xl text-muted-foreground">
                                            {String(
                                                activeTestimonial + 1,
                                            ).padStart(2, '0')}{' '}
                                            <span className="font-sans text-sm">
                                                /{' '}
                                                {String(
                                                    testimonials.length,
                                                ).padStart(2, '0')}
                                            </span>
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            aria-label="Previous testimonial"
                                            onClick={() =>
                                                showTestimonial(
                                                    activeTestimonial - 1,
                                                )
                                            }
                                        >
                                            <ArrowLeft />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            aria-label="Next testimonial"
                                            onClick={() =>
                                                showTestimonial(
                                                    activeTestimonial + 1,
                                                )
                                            }
                                        >
                                            <ArrowRight />
                                        </Button>
                                    </div>
                                </div>
                                <div
                                    className="flex gap-2"
                                    role="tablist"
                                    aria-label="Choose a testimonial"
                                >
                                    {testimonials.map((item, index) => (
                                        <button
                                            key={item.name}
                                            type="button"
                                            role="tab"
                                            aria-selected={
                                                index === activeTestimonial
                                            }
                                            aria-label={`Show testimonial from ${item.name}`}
                                            className={`h-1.5 rounded-full transition-all ${
                                                index === activeTestimonial
                                                    ? 'w-10 bg-primary'
                                                    : 'w-5 bg-primary/20 hover:bg-primary/50'
                                            }`}
                                            onClick={() =>
                                                showTestimonial(index)
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <Contact />
            </div>
        </>
    );
}
