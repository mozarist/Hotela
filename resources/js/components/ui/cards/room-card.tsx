import { BedDouble, Search, Star } from "lucide-react";
import { Badge } from "../badge";
import { Button } from "../button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../card";

export default function RoomCard() {
    return (
        <Card className="relative pt-0">
            <div className="w-full h-40 bg-muted overflow-hidden">
                <img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" className="w-full h-full object-cover object-center" />
            </div>
            <div className="absolute top-3 right-3">
                <Badge variant="secondary"><Star className="fill-yellow-400 text-yellow-400" />4.8</Badge>
            </div>
            <CardHeader>
                <CardTitle>Room Title</CardTitle>
                <CardDescription>Room description goes here.</CardDescription>
            </CardHeader>
            <CardFooter>
            <div className="w-full flex items-center justify-between">
                <span className="text-base font-semibold">$100/night</span>
                <CardAction>
                    <div className="flex gap-1 items-center">
                        <Button variant={"outline"}>
                            <Search />
                            View Details
                        </Button>
                        <Button>
                            <BedDouble />
                            Book Now
                        </Button>
                    </div>
                </CardAction>
            </div>
            </CardFooter>
        </Card>
    )
}
