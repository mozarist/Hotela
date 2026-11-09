import { Link } from '@inertiajs/react';
import {
    BedDouble,
    CalendarPlus,
    DoorOpen,
    Hotel,
    LayoutGrid,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { booking, dashboard, home } from '@/routes';
import { index as roomTypesIndex } from '@/routes/dashboard/room-types';
import { index as roomsIndex } from '@/routes/dashboard/rooms';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Room types',
        href: roomTypesIndex(),
        icon: BedDouble,
    },
    {
        title: 'Rooms',
        href: roomsIndex(),
        icon: DoorOpen,
    },
    {
        title: 'New booking',
        href: booking(),
        icon: CalendarPlus,
    },
    {
        title: 'Guest site',
        href: home(),
        icon: Hotel,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="group-data-[collapsible=icon]:justify-center"
                        >
                            <Link href={dashboard()} prefetch>
                                <AppLogo className="group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center" />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
