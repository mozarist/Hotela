import { Head } from '@inertiajs/react';
import FeaturedRooms from '@/components/blocks/featured-rooms';
import HeroSection from '@/components/blocks/hero';
import OurServices from '@/components/blocks/services';
import type { Room } from '@/types/hotel';

export default function Welcome({ rooms }: { rooms: Room[] }) {
    return (
        <>
            <Head title="Find the best stay" />

            <div className="flex w-full flex-col items-center gap-20 overflow-hidden py-12 md:py-16">
                <HeroSection />
                <FeaturedRooms rooms={rooms} />
                <OurServices />
            </div>
        </>
    );
}
