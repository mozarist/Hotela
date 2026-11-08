import { Head, Link, router } from '@inertiajs/react';
import type { Users } from 'lucide-react';
import {
    ArrowUpRight,
    Banknote,
    BedDouble,
    CalendarCheck,
    Coffee,
    Ellipsis,
    Eye,
    Plus,
    RotateCcw,
    Search,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/format';
import { booking, dashboard } from '@/routes';
import { summary as bookingSummaryRoute } from '@/routes/bookings';
import { destroy } from '@/routes/dashboard/bookings';
import type { DashboardBooking, PaginationLink } from '@/types/hotel';

type DashboardProps = {
    bookings: {
        data: DashboardBooking[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
        links: PaginationLink[];
    };
    rooms: Array<{ id: number; name: string; price: number }>;
    filters: {
        search: string;
        room_id: number | null;
    };
    summary: {
        totalBookings: number;
        totalRevenue: number;
        upcomingBookings: number;
        breakfastBookings: number;
        totalNights: number;
    };
};

function StatCard({
    label,
    value,
    description,
    icon: Icon,
}: {
    label: string;
    value: string;
    description: string;
    icon: typeof Users;
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                <div>
                    <CardDescription>{label}</CardDescription>
                    <CardTitle className="mt-1 font-serif text-3xl tabular-nums">
                        {value}
                    </CardTitle>
                </div>
                <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
                    <Icon className="size-5 text-muted-foreground" />
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}

export default function Dashboard({
    bookings,
    rooms,
    filters,
    summary,
}: DashboardProps) {
    const [search, setSearch] = useState(filters.search);
    const [roomId, setRoomId] = useState(
        filters.room_id ? String(filters.room_id) : 'all',
    );
    const [pendingDelete, setPendingDelete] = useState<DashboardBooking | null>(
        null,
    );
    const [deleting, setDeleting] = useState(false);

    const navigationOptions = {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    } as const;

    function applyFilters(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        router.get(
            dashboard.url(),
            {
                search: search.trim() || undefined,
                room_id: roomId === 'all' ? undefined : roomId,
            },
            navigationOptions,
        );
    }

    function resetFilters() {
        setSearch('');
        setRoomId('all');
        router.get(dashboard.url(), {}, navigationOptions);
    }

    function confirmDelete() {
        if (!pendingDelete) {
            return;
        }

        setDeleting(true);

        router.delete(destroy.url(pendingDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(
                    `Booking for ${pendingDelete.guest_name} was deleted.`,
                );
                setPendingDelete(null);
            },
            onError: () => {
                toast.error('The booking could not be deleted.');
            },
            onFinish: () => {
                setDeleting(false);
            },
        });
    }

    return (
        <>
            <Head title="Admin dashboard" />

            <div className="flex h-full flex-1 flex-col gap-5 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="font-serif text-3xl">
                            Booking overview
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Every reservation, guest, and payment in one place.
                        </p>
                    </div>

                    <Button asChild>
                        <Link href={booking.url()}>
                            <Plus />
                            New booking
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        label="Total bookings"
                        value={summary.totalBookings.toLocaleString('id-ID')}
                        description="All reservations recorded in Hotela."
                        icon={CalendarCheck}
                    />
                    <StatCard
                        label="Total revenue"
                        value={formatCurrency(summary.totalRevenue)}
                        description="Accumulated value of all bookings."
                        icon={Banknote}
                    />
                    <StatCard
                        label="Upcoming stays"
                        value={summary.upcomingBookings.toLocaleString('id-ID')}
                        description="Check-ins scheduled from today onward."
                        icon={BedDouble}
                    />
                    <StatCard
                        label="Breakfast add-ons"
                        value={summary.breakfastBookings.toLocaleString(
                            'id-ID',
                        )}
                        description={`${summary.totalNights.toLocaleString('id-ID')} total nights booked.`}
                        icon={Coffee}
                    />
                </div>

                <Card className="overflow-hidden pb-0">
                    <CardHeader className="gap-4">
                        <div>
                            <CardTitle>Booking history</CardTitle>
                            <CardDescription>
                                Search by guest name or identity number, then
                                filter by room type.
                            </CardDescription>
                        </div>

                        <form
                            onSubmit={applyFilters}
                            className="flex flex-col gap-2 md:flex-row"
                        >
                            <div className="relative flex-1">
                                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search guest or identity number..."
                                    className="pl-9"
                                />
                            </div>

                            <Select value={roomId} onValueChange={setRoomId}>
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="All rooms" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All rooms
                                    </SelectItem>
                                    {rooms.map((room) => (
                                        <SelectItem
                                            key={room.id}
                                            value={String(room.id)}
                                        >
                                            {room.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <div className="flex gap-2">
                                <Button type="submit">
                                    <Search />
                                    Apply
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={resetFilters}
                                >
                                    <RotateCcw />
                                    Reset
                                </Button>
                            </div>
                        </form>
                    </CardHeader>

                    <CardContent className="p-0">
                        {bookings.data.length > 0 ? (
                            <>
                                <Table className="rounded-none border-0">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Guest</TableHead>
                                            <TableHead>Room</TableHead>
                                            <TableHead>Stay</TableHead>
                                            <TableHead>Breakfast</TableHead>
                                            <TableHead>Discount</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Booked</TableHead>
                                            <TableHead className="text-right" />
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {bookings.data.map((bookingItem) => (
                                            <TableRow key={bookingItem.id}>
                                                <TableCell>
                                                    <div className="font-medium">
                                                        {bookingItem.guest_name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {bookingItem.gender} ·{' '}
                                                        {
                                                            bookingItem.identity_number
                                                        }
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <Badge variant="secondary">
                                                        {bookingItem.room.name}
                                                    </Badge>
                                                    <div className="mt-1 text-xs text-muted-foreground">
                                                        {formatCurrency(
                                                            bookingItem.room
                                                                .price,
                                                        )}{' '}
                                                        / night
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <div>
                                                        {formatDate(
                                                            bookingItem.booking_date,
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {
                                                            bookingItem.duration_days
                                                        }{' '}
                                                        night
                                                        {bookingItem.duration_days ===
                                                        1
                                                            ? ''
                                                            : 's'}
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            bookingItem.includes_breakfast
                                                                ? 'default'
                                                                : 'outline'
                                                        }
                                                    >
                                                        {bookingItem.includes_breakfast
                                                            ? 'Included'
                                                            : 'No'}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell>
                                                    {bookingItem.discount_amount >
                                                    0 ? (
                                                        <span className="text-emerald-600 dark:text-emerald-400">
                                                            -
                                                            {formatCurrency(
                                                                bookingItem.discount_amount,
                                                            )}
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground">
                                                            -
                                                        </span>
                                                    )}
                                                </TableCell>

                                                <TableCell className="font-medium">
                                                    {formatCurrency(
                                                        bookingItem.total_payment,
                                                    )}
                                                </TableCell>

                                                <TableCell className="text-xs text-muted-foreground">
                                                    {formatDateTime(
                                                        bookingItem.created_at,
                                                    )}
                                                </TableCell>

                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon-sm"
                                                            >
                                                                <Ellipsis />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={bookingSummaryRoute.url(
                                                                        bookingItem.id,
                                                                    )}
                                                                >
                                                                    <Eye />
                                                                    View invoice
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                asChild
                                                            >
                                                                <a
                                                                    href={bookingSummaryRoute.url(
                                                                        bookingItem.id,
                                                                    )}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                >
                                                                    <ArrowUpRight />
                                                                    Open in new
                                                                    tab
                                                                </a>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                variant="destructive"
                                                                onClick={() =>
                                                                    setPendingDelete(
                                                                        bookingItem,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 />
                                                                Delete booking
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                <div className="flex flex-col items-center justify-between gap-3 border-t px-4 py-3 sm:flex-row">
                                    <p className="text-xs text-muted-foreground">
                                        Showing {bookings.from ?? 0}-
                                        {bookings.to ?? 0} of {bookings.total}
                                    </p>

                                    {bookings.last_page > 1 && (
                                        <div className="flex flex-wrap items-center gap-1.5">
                                            {bookings.links.map(
                                                (link, index) =>
                                                    link.url ? (
                                                        <Button
                                                            key={`${link.label}-${index}`}
                                                            asChild
                                                            size="sm"
                                                            variant={
                                                                link.active
                                                                    ? 'default'
                                                                    : 'outline'
                                                            }
                                                        >
                                                            <Link
                                                                href={link.url}
                                                                preserveScroll
                                                            >
                                                                <span
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: link.label,
                                                                    }}
                                                                />
                                                            </Link>
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            key={`${link.label}-${index}`}
                                                            size="sm"
                                                            variant="outline"
                                                            disabled
                                                        >
                                                            <span
                                                                dangerouslySetInnerHTML={{
                                                                    __html: link.label,
                                                                }}
                                                            />
                                                        </Button>
                                                    ),
                                            )}
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
                                <CalendarCheck className="size-10 text-muted-foreground/60" />
                                <p className="font-medium">
                                    No bookings found.
                                </p>
                                <p className="max-w-sm text-sm text-muted-foreground">
                                    Try a different search or reset the filters
                                    to see the full booking history.
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={resetFilters}
                                    className="mt-2"
                                >
                                    <RotateCcw />
                                    Reset filters
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <AlertDialog
                open={pendingDelete !== null}
                onOpenChange={(open) => {
                    if (!open && !deleting) {
                        setPendingDelete(null);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete this booking?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            The reservation for{' '}
                            <strong>{pendingDelete?.guest_name}</strong> will be
                            permanently removed. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={deleting}
                        >
                            {deleting ? 'Deleting...' : 'Delete booking'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
