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

            <div className="relative -mt-16 flex w-full flex-col items-center gap-20 overflow-hidden">
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
                <FeaturedRooms roomTypes={roomTypes} />
                <Contact />
            </div>
        </>
    );
}
