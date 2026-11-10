import { Head } from '@inertiajs/react';
import Contact from '@/components/blocks/contact';
import FeaturedRooms from '@/components/blocks/featured-rooms';
import HeroSection from '@/components/blocks/hero';
import OurServices from '@/components/blocks/services';
import type { RoomType } from '@/types/hotel';

export default function Welcome({ roomTypes }: { roomTypes: RoomType[] }) {
    return (
        <>
            <Head title="Find the best stay" />

            <div className="relative -mt-16 flex w-full flex-col items-center gap-24 overflow-hidden">
                <HeroSection />

                {/* About Section */}
                <div id="about" className="max-w-7xl flex flex-col md:flex-row justify-center md:justify-between items-center gap-4 px-4 w-full">
                    <p className="flex-1 text-xl xl:text-2xl font-medium">
                        We are a boutique hotel that offers a unique and personalized experience for our guests. Our rooms are designed with comfort and style in mind, and our staff is dedicated to providing exceptional service. Whether you're here for business or leisure, we strive to make your stay memorable.
                    </p>

                    <div className="flex-1 justify-center md:justify-end flex divide-x divide-border text-center w-full">
                        <div className="flex flex-col items-center justify-center gap-2 px-6 py-4">
                            <span className="text-4xl md:text-5xl font-serif">14+ Years</span>
                            <span className="text-sm text-muted-foreground">of Experience</span>
                        </div>

                        <div className="flex flex-col items-center justify-center gap-2 px-6 py-4">
                            <span className="text-4xl md:text-5xl font-serif">5</span>
                            <span className="text-sm text-muted-foreground">Star Rating</span>
                        </div>

                        <div className="flex flex-col items-center justify-center gap-2 px-6 py-4">
                            <span className="text-4xl md:text-5xl font-serif">100%</span>
                            <span className="text-sm text-muted-foreground">Guest Satisfaction</span>
                        </div>
                    </div>
                </div>

                <OurServices />

                {/* mini gallery */}
                <div className="max-w-7xl grid md:grid-cols-3 justify-center gap-4 px-4 w-full">
                    <div className="aspect-square w-full bg-muted overflow-hidden rounded-3xl">
                        <img src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" alt="Room 1" className="h-full w-full object-cover" />
                    </div>
                    <div className="aspect-square w-full bg-muted overflow-hidden rounded-3xl">
                        <img src="https://images.unsplash.com/photo-1549294413-26f195200c16?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" alt="Room 2" className="h-full w-full object-cover" />
                    </div>
                    <div className="aspect-square w-full bg-muted overflow-hidden rounded-3xl">
                        <img src="https://images.unsplash.com/photo-1758380388614-66e9fd1aa159?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" alt="Room 3" className="h-full w-full object-cover" />
                    </div>
                </div>

                <FeaturedRooms roomTypes={roomTypes} />
                <Contact />
            </div>
        </>
    );
}
