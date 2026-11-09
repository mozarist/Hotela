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
                <FeaturedRooms roomTypes={roomTypes} />
                <OurServices />
                <Contact />
            </div>
        </>
    );
}
