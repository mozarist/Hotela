import FeaturedRooms from "@/components/blocks/featured-rooms";
import HeroSection from "@/components/blocks/hero";
import NavBar from "@/components/blocks/navbar";
import OurServices from "@/components/blocks/services";

export default function Welcome() {
  return (
    <div className="flex flex-col items-center gap-16 pb-16 overflow-hidden">
        <NavBar />
        <HeroSection />
        <FeaturedRooms />
        <OurServices />
    </div>
  )
}
