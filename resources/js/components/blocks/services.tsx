import { Dumbbell, HandPlatter, Sparkles, UtensilsCrossed, WavesLadder, Wifi } from "lucide-react";
import { Card } from "../ui/card";

const ServiceCard = ({ icon, title }: { icon: React.ReactNode, title: string }) => {
    return (
        <Card className="aspect-square items-center justify-center gap-3">
            {icon}
            <h3 className="text-lg font-semibold">{title}</h3>
        </Card>
    );
};

const services = [
    { icon: <Wifi size={42} />, title: "Free Wi-Fi" },
    { icon: <WavesLadder size={42} />, title: "Swimming Pool" },
    { icon: <HandPlatter size={42} />, title: "24/7 Services" },
    { icon: <Dumbbell size={42} />, title: "Fitness Center" },
    { icon: <Sparkles size={42} />, title: "Spa & Wellness" },
    { icon: <UtensilsCrossed size={42} />, title: "Restaurant & Bar" },
];

export default function OurServices() {
        return (
            <div id="services" className="w-full scroll-mt-24">
                <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 w-full">
                    <div className="flex items-center justify-between gap-6 w-full">
                        <div className="border w-full" />
                        <h2 className="text-5xl md:text-4xl lg:text-5xl text-center font-serif min-w-sm">What We Offer</h2>
                        <div className="border w-full" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                        {services.map((service, index) => (
                            <ServiceCard key={index} icon={service.icon} title={service.title} />
                        ))}
                    </div>

                </div>
            </div>
        )
    }
