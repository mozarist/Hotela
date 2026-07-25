import { Circle, CircleArrowRight } from "lucide-react";
import { Badge } from "../ui/badge";
import AppLogo from "../app-logo";
import { Button } from "../ui/button";

export default function NavBar() {
    return (
        <nav className="fixed top-0 bg-background w-full h-16 px-16 flex items-center justify-between z-999">
            <div className="flex-1">
                <AppLogo />
            </div>
            <div className="relative flex-2 flex items-center justify-center gap-4 text-lg font-medium w-fit">
                <a href="/" className="text-muted-foreground hover:text-foreground">Home</a>
                <a href="#" className="text-muted-foreground hover:text-foreground">Rooms & Services</a>
                <a href="#" className="text-muted-foreground hover:text-foreground">About Us</a>
                <a href="#" className="text-muted-foreground hover:text-foreground">Contact</a>
            </div>
            <div className="flex-1 flex justify-end">
                <Button>
                    <CircleArrowRight /> Book a Room
                </Button>
            </div>
        </nav>
    )
}
