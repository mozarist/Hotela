import { CircleArrowRight } from 'lucide-react'
import { Button } from '../ui/button'

export default function HeroSection() {
  return (
    <div className="w-screen h-screen flex items-center justify-between p-16">
      <div className="flex-1 flex flex-col gap-6">
        <h1 className="text-7xl text-primary font-serif tracking-tight max-w-lg">Moments worth staying for.</h1>
        <p className="text-muted-foreground max-w-lg">
          Experience the perfect blend of comfort, luxury, and convenience at our hotel. Whether you're here for business or leisure, we provide an unforgettable stay that caters to your every need.
        </p>
        <div className="flex items-center gap-1">
          <Button variant="outline">
            <CircleArrowRight /> View Our Services
          </Button>
          <Button>
            <CircleArrowRight /> Book a Room
          </Button>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-4 gap-1 h-full">
        <div className="h-full w-full overflow-hidden col-span-2">
          <img src="https://images.unsplash.com/photo-1549294413-26f195200c16?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWx8ZW58MHx8MHx8fDA%3D" alt="" className="bg-muted w-full h-full object-cover" />
        </div>
        <div className="h-full w-full overflow-hidden">
          <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" className="bg-muted w-full h-full object-cover" />
        </div>
        <div className="h-full w-full overflow-hidden">
          <img src="https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?q=80&w=327&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" className="bg-muted w-full h-full object-cover" />
        </div>
      </div>
    </div>
  )
}
