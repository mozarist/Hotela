import FeaturedRooms from "@/components/blocks/featured-rooms";
import HeroSection from "@/components/blocks/hero";
import OurServices from "@/components/blocks/services";
import { Head } from "@inertiajs/react";

export default function Welcome() {
  return (
    <>
    <Head title="Find the best stay" />

    <div className="flex flex-col items-center gap-16 py-16 w-full overflow-hidden">
        <HeroSection />
        <FeaturedRooms />
        <OurServices />
    </div>
    </>
  )
}