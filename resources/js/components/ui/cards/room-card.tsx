import { Link } from '@inertiajs/react';
import { BedDouble, Sparkles } from 'lucide-react';
import RoomImage from '@/components/hotel/room-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/format';
import { booking } from '@/routes';
import type { RoomType } from '@/types/hotel';

export default function RoomCard({ roomType }: { roomType: RoomType }) {
    return (
        <div className="group grid md:grid-cols-2 gap-4">
            <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden">
                <RoomImage
                    src={roomType.image_url}
                    alt={`${roomType.name} room`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/50 to-transparent" />
            </div>

            <div className="flex flex-col gap-4 justify-center w-full h-full">
                <div>
                    <CardTitle className="text-xl md:text-2xl xl:text-3xl">{roomType.name}</CardTitle>
                    <p className="mt-1 text-lg">
                        {formatCurrency(roomType.price)} / night
                    </p>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">
                    {roomType.description}
                </p>

                <Button size="sm" asChild className="w-full md:w-fit">
                    <Link href={booking.url({ query: { room_type: roomType.id } })}>
                        Book this room
                        <BedDouble />
                    </Link>
                </Button>
            </div>
        </div>
    );
}
