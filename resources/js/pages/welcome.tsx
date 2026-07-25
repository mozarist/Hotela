import FeaturedRooms from "@/components/blocks/featured-rooms";
import HeroSection from "@/components/blocks/hero";
import NavBar from "@/components/blocks/navbar";

export default function Welcome() {
  return (
    <div className="flex flex-col items-center h-500 overflow-hidden">
        <NavBar />
        <HeroSection />
        <FeaturedRooms />
    </div>
  )
}
