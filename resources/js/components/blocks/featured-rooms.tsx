import { Hotel } from "lucide-react";
import { Button } from "../ui/button";
import RoomCard from "../ui/cards/room-card";


export default function FeaturedRooms() {
    return (
        <div className="w-full">
            <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 w-full">
                <div className="flex items-center justify-between gap-6 w-full">
                    <h2 className="text-5xl md:text-4xl lg:text-5xl font-serif min-w-sm">Rooms For You</h2>
                    <div className="border w-full" />
                    <Button variant="default">
                        <Hotel />
                        Explore More Rooms
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <RoomCard />
                    <RoomCard />
                    <RoomCard />
                </div>

            </div>
        </div>
    )
}
