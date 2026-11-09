import { Link } from '@inertiajs/react';
import { ArrowRight, Hotel } from 'lucide-react';
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
                <div className="flex w-full flex-col items-start justify-between gap-5 md:flex-row md:items-center">
                    <div>
                        <p className="text-xs font-semibold tracking-[0.24em] text-muted-foreground uppercase">
                            The collection
                        </p>
                        <h2 className="mt-2 font-serif text-4xl md:text-5xl">
                            Rooms made for you
                        </h2>
                    </div>

                    <Button asChild variant="outline">
                        <Link href={booking.url()}>
                            <Hotel />
                            Start a booking
                            <ArrowRight />
                        </Link>
                    </Button>
                </div>

                {roomTypes.length > 0 ? (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
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
