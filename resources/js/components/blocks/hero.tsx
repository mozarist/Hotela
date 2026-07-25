import { CircleArrowRight } from 'lucide-react'
import { Button } from '../ui/button'

export default function HeroSection() {
  return (
    <div className="w-screen h-screen flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 p-5 py-24 md:p-16 md:py-16">
      <div className="flex-1 flex flex-col items-center md:items-start gap-6">
        <h1 className="text-7xl md:text-6xl lg:text-7xl xl:text-8xl text-primary text-center md:text-start font-serif tracking-tight max-w-lg">Moments worth staying for.</h1>
        <p className="text-muted-foreground text-center md:text-start max-w-md">
          Discover thoughtfully designed rooms, warm hospitality, and a stay where comfort meets timeless elegance.
        </p>
        <div className="flex items-center gap-1">
          <Button variant="outline">
            <CircleArrowRight /> Explore Our Rooms
          </Button>
          <Button>
            <CircleArrowRight /> Book Now
          </Button>
        </div>
      </div>
      <div className="flex-1 h-full w-full rounded-2xl overflow-hidden">
        <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" className="bg-muted w-full h-full object-cover" />
      </div>
    </div>
  )
}
