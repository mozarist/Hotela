import { Head } from '@inertiajs/react';
import FeaturedRooms from '@/components/blocks/featured-rooms';
import HeroSection from '@/components/blocks/hero';
import OurServices from '@/components/blocks/services';
import type { Room } from '@/types/hotel';

export default function Welcome({ rooms }: { rooms: Room[] }) {
    return (
        <>
            <Head title="Find the best stay" />

            <div className="relative -mt-16 flex w-full flex-col items-center gap-20 overflow-hidden">
                <HeroSection />
                <FeaturedRooms rooms={rooms} />
                <OurServices />
            </div>
        </>
    );
}
