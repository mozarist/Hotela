import { Link } from '@inertiajs/react';
import { ArrowRight, BedDouble, Hotel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RoomCard from '@/components/ui/cards/room-card';
import { booking } from '@/routes';
import type { RoomType } from '@/types/hotel';

export default function FeaturedRooms({
    roomTypes,
}: {
    roomTypes: RoomType[];
}) {
    return (
        <section id="rooms" className="w-full scroll-mt-24">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4">
                <h2 className="text-5xl md:text-4xl lg:text-5xl font-serif w-full max-w-sm text-balance capitalize">The best rooms for your stay</h2>

                {roomTypes.length > 0 ? (
                    <div className="grid grid-cols-1 gap-8">
                        {roomTypes.map((roomType) => (
                            <RoomCard key={roomType.id} roomType={roomType} />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed p-12 text-center">
                        <p className="font-medium">Rooms are being prepared.</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Please check back in a moment.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
