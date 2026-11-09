import { Head, router, useForm } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import {
    BedDouble,
    CalendarCheck,
    Ellipsis,
    ImagePlus,
    Pencil,
    Plus,
    Search,
    Trash2,
    Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import RoomImage from '@/components/hotel/room-image';
import InputError from '@/components/input-error';
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
import { Label } from '@/components/ui/label';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/lib/format';
import { dashboard } from '@/routes';
import {
    destroy,
    index as roomsIndex,
    store,
    update,
} from '@/routes/dashboard/rooms';
import type { AdminRoom } from '@/types/hotel';

type RoomsPageProps = {
    rooms: AdminRoom[];
    summary: {
        totalRooms: number;
        bookedRooms: number;
        totalBookings: number;
    };
};

type RoomFormData = {
    name: string;
    price: number | '';
    description: string;
    image: File | null;
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
    icon: LucideIcon;
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

function RoomForm({
    room,
    onCancel,
    onSaved,
}: {
    room: AdminRoom | null;
    onCancel: () => void;
    onSaved: () => void;
}) {
    const form = useForm<RoomFormData>({
        name: room?.name ?? '',
        price: room?.price ?? '',
        description: room?.description ?? '',
        image: null,
    });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0] ?? null;

        form.setData('image', file);
        setPreviewUrl(file ? URL.createObjectURL(file) : null);
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const options = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success(
                    room
                        ? 'Room updated successfully.'
                        : 'Room added successfully.',
                );
                onSaved();
            },
            onError: () => {
                toast.error(
                    'Please check the highlighted fields and try again.',
                );
            },
        };

        if (room) {
            form.transform((data) => ({ ...data, _method: 'put' }));
            form.post(update.url(room.id), options);

            return;
        }

        form.post(store.url(), options);
    }

    const imageSource = previewUrl ?? room?.image_url ?? null;

    return (
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-5 overflow-y-auto px-6 pb-6">
                <div className="space-y-2">
                    <Label htmlFor="name">
                        Room name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="name"
                        value={form.data.name}
                        onChange={(event) =>
                            form.setData('name', event.target.value)
                        }
                        placeholder="Deluxe Suite"
                        disabled={form.processing}
                    />
                    <InputError message={form.errors.name} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="price">
                        Price per night{' '}
                        <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="price"
                        type="number"
                        min={0}
                        step={1000}
                        value={form.data.price}
                        onChange={(event) =>
                            form.setData(
                                'price',
                                event.target.value === ''
                                    ? ''
                                    : Number(event.target.value),
                            )
                        }
                        placeholder="750000"
                        disabled={form.processing}
                    />
                    <p className="text-xs text-muted-foreground">
                        {form.data.price !== ''
                            ? formatCurrency(Number(form.data.price))
                            : 'Enter the nightly rate in rupiah.'}
                    </p>
                    <InputError message={form.errors.price} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">
                        Description <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                        id="description"
                        rows={5}
                        value={form.data.description}
                        onChange={(event) =>
                            form.setData('description', event.target.value)
                        }
                        placeholder="Describe the room, its view, and included amenities."
                        disabled={form.processing}
                    />
                    <InputError message={form.errors.description} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="image">
                        Room image{' '}
                        {!room && <span className="text-destructive">*</span>}
                    </Label>

                    <div className="flex items-center gap-3 rounded-2xl border bg-muted/30 p-3">
                        {imageSource ? (
                            <img
                                src={imageSource}
                                alt={
                                    room ? `${room.name} room` : 'Room preview'
                                }
                                className="size-16 shrink-0 rounded-xl object-cover"
                            />
                        ) : (
                            <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                                <ImagePlus className="size-6" />
                            </div>
                        )}
                        <div className="min-w-0 flex-1 space-y-1">
                            <Input
                                id="image"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImageChange}
                                disabled={form.processing}
                                className="cursor-pointer"
                            />
                            <p className="text-xs text-muted-foreground">
                                JPG, PNG, or WebP up to 2 MB.
                                {room
                                    ? ' Leave empty to keep the current image.'
                                    : ''}
                            </p>
                        </div>
                    </div>
                    <InputError message={form.errors.image} />
                </div>
            </div>

            <SheetFooter className="border-t">
                <Button
                    type="submit"
                    disabled={form.processing}
                    className="w-full"
                >
                    {form.processing
                        ? 'Saving...'
                        : room
                          ? 'Save changes'
                          : 'Add room'}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={form.processing}
                    className="w-full"
                >
                    Cancel
                </Button>
            </SheetFooter>
        </form>
    );
}

export default function Rooms({ rooms, summary }: RoomsPageProps) {
    const [search, setSearch] = useState('');
    const [sheetOpen, setSheetOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<AdminRoom | null>(null);
    const [pendingDelete, setPendingDelete] = useState<AdminRoom | null>(null);
    const [deleting, setDeleting] = useState(false);

    const filteredRooms = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (query === '') {
            return rooms;
        }

        return rooms.filter((room) => room.name.toLowerCase().includes(query));
    }, [rooms, search]);

    function openCreateSheet() {
        setEditingRoom(null);
        setSheetOpen(true);
    }

    function openEditSheet(room: AdminRoom) {
        setEditingRoom(room);
        setSheetOpen(true);
    }

    function closeSheet() {
        setSheetOpen(false);
    }

    function confirmDelete() {
        if (!pendingDelete) {
            return;
        }

        setDeleting(true);

        router.delete(destroy.url(pendingDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`${pendingDelete.name} room was deleted.`);
                setPendingDelete(null);
            },
            onError: () => {
                toast.error('The room could not be deleted.');
            },
            onFinish: () => {
                setDeleting(false);
            },
        });
    }

    const blockedByBookings = (pendingDelete?.bookings_count ?? 0) > 0;

    return (
        <>
            <Head title="Room management" />

            <div className="flex h-full flex-1 flex-col gap-5 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="font-serif text-3xl">Rooms</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage the room catalogue and track how often each
                            room is booked.
                        </p>
                    </div>

                    <Button onClick={openCreateSheet}>
                        <Plus />
                        Add room
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <StatCard
                        label="Total rooms"
                        value={summary.totalRooms.toLocaleString('id-ID')}
                        description="Room types available in the catalogue."
                        icon={BedDouble}
                    />
                    <StatCard
                        label="Rooms booked"
                        value={summary.bookedRooms.toLocaleString('id-ID')}
                        description="Room types that have at least one booking."
                        icon={Users}
                    />
                    <StatCard
                        label="Total bookings"
                        value={summary.totalBookings.toLocaleString('id-ID')}
                        description="All reservations across every room."
                        icon={CalendarCheck}
                    />
                </div>

                <Card className="overflow-hidden pb-0">
                    <CardHeader className="gap-4">
                        <div>
                            <CardTitle>Room catalogue</CardTitle>
                            <CardDescription>
                                Each room shows its nightly rate and the number
                                of reservations it has received.
                            </CardDescription>
                        </div>

                        <div className="relative w-full md:max-w-sm">
                            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search rooms..."
                                className="pl-9"
                            />
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        {filteredRooms.length > 0 ? (
                            <Table className="rounded-none border-0">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Room</TableHead>
                                        <TableHead>Price / night</TableHead>
                                        <TableHead>Bookings</TableHead>
                                        <TableHead>Revenue</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-right" />
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {filteredRooms.map((room) => (
                                        <TableRow key={room.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <RoomImage
                                                        src={room.image_url}
                                                        alt={`${room.name} room`}
                                                        className="size-11 shrink-0 rounded-xl object-cover"
                                                    />
                                                    <div>
                                                        <div className="font-medium">
                                                            {room.name}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {room.bookings_count >
                                                            0
                                                                ? `Booked ${room.bookings_count} time${room.bookings_count === 1 ? '' : 's'}`
                                                                : 'No bookings yet'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell className="font-medium">
                                                {formatCurrency(room.price)}
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        room.bookings_count > 0
                                                            ? 'secondary'
                                                            : 'outline'
                                                    }
                                                >
                                                    {room.bookings_count.toLocaleString(
                                                        'id-ID',
                                                    )}
                                                </Badge>
                                            </TableCell>

                                            <TableCell>
                                                {formatCurrency(
                                                    room.bookings_revenue,
                                                )}
                                            </TableCell>

                                            <TableCell className="max-w-xs">
                                                <p className="line-clamp-2 text-sm text-muted-foreground">
                                                    {room.description}
                                                </p>
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
                                                            onClick={() =>
                                                                openEditSheet(
                                                                    room,
                                                                )
                                                            }
                                                        >
                                                            <Pencil />
                                                            Edit room
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            variant="destructive"
                                                            onClick={() =>
                                                                setPendingDelete(
                                                                    room,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 />
                                                            Delete room
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
                                <BedDouble className="size-10 text-muted-foreground/60" />
                                <p className="font-medium">No rooms found.</p>
                                <p className="max-w-sm text-sm text-muted-foreground">
                                    {search !== ''
                                        ? 'Try a different search term.'
                                        : 'Add the first room to start accepting bookings.'}
                                </p>
                                {search === '' && (
                                    <Button
                                        variant="outline"
                                        onClick={openCreateSheet}
                                        className="mt-2"
                                    >
                                        <Plus />
                                        Add room
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent
                    side="right"
                    className="flex w-full flex-col gap-0 sm:max-w-md"
                >
                    <SheetHeader>
                        <SheetTitle>
                            {editingRoom ? 'Edit room' : 'Add a room'}
                        </SheetTitle>
                        <SheetDescription>
                            {editingRoom
                                ? 'Update the room details below. Changes are visible to guests immediately.'
                                : 'Fill in the room details to add it to the catalogue.'}
                        </SheetDescription>
                    </SheetHeader>

                    <RoomForm
                        key={`${sheetOpen ? 'open' : 'closed'}-${editingRoom?.id ?? 'new'}`}
                        room={editingRoom}
                        onCancel={closeSheet}
                        onSaved={closeSheet}
                    />
                </SheetContent>
            </Sheet>

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
                        <AlertDialogTitle>Delete this room?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {blockedByBookings ? (
                                <>
                                    <strong>{pendingDelete?.name}</strong> still
                                    has {pendingDelete?.bookings_count} booking
                                    {pendingDelete?.bookings_count === 1
                                        ? ''
                                        : 's'}
                                    . Remove those bookings before deleting this
                                    room.
                                </>
                            ) : (
                                <>
                                    <strong>{pendingDelete?.name}</strong> will
                                    be permanently removed from the catalogue.
                                    This action cannot be undone.
                                </>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={deleting || blockedByBookings}
                        >
                            {deleting ? 'Deleting...' : 'Delete room'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

Rooms.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Rooms',
            href: roomsIndex(),
        },
    ],
};
