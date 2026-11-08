import { Link } from '@inertiajs/react';
import { BedDouble, Sparkles } from 'lucide-react';
import RoomImage from '@/components/hotel/room-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/format';
import { booking } from '@/routes';
import type { Room } from '@/types/hotel';

export default function RoomCard({ room }: { room: Room }) {
    return (
        <Card className="group pt-0 transition-shadow hover:ring-foreground/20 hover:shadow-lg">
            <div className="relative h-52 overflow-hidden">
                <RoomImage
                    src={room.image_url}
                    alt={`${room.name} room`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
                <Badge variant="secondary" className="absolute top-3 left-3">
                    <Sparkles className="size-3" />
                    Signature stay
                </Badge>
            </div>

            <CardHeader>
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <CardTitle className="text-xl">{room.name} Room</CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {formatCurrency(room.price)} / night
                        </p>
                    </div>
                    <BedDouble className="mt-1 size-5 text-muted-foreground" />
                </div>
            </CardHeader>

            <CardContent>
                <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {room.description}
                </p>
            </CardContent>

            <CardFooter>
                <Button asChild className="w-full">
                    <Link href={booking.url({ query: { room: room.id } })}>
                        Book this room
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
