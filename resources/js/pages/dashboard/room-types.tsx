import { Head, router, useForm } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import {
    BedDouble,
    CalendarCheck,
    DoorOpen,
    Ellipsis,
    ImagePlus,
    Pencil,
    Plus,
    Search,
    Trash2,
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
    index as roomTypesIndex,
    store,
    update,
} from '@/routes/dashboard/room-types';
import type { AdminRoomType } from '@/types/hotel';

type RoomTypesPageProps = {
    roomTypes: AdminRoomType[];
    summary: {
        totalRoomTypes: number;
        totalRooms: number;
        bookedRoomTypes: number;
        totalBookings: number;
    };
};

type RoomTypeFormData = {
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

function RoomTypeForm({
    roomType,
    onCancel,
    onSaved,
}: {
    roomType: AdminRoomType | null;
    onCancel: () => void;
    onSaved: () => void;
}) {
    const form = useForm<RoomTypeFormData>({
        name: roomType?.name ?? '',
        price: roomType?.price ?? '',
        description: roomType?.description ?? '',
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
                    roomType
                        ? 'Room type updated successfully.'
                        : 'Room type added successfully.',
                );
                onSaved();
            },
            onError: () => {
                toast.error(
                    'Please check the highlighted fields and try again.',
                );
            },
        };

        if (roomType) {
            form.transform((data) => ({ ...data, _method: 'put' }));
            form.post(update.url(roomType.id), options);

            return;
        }

        form.post(store.url(), options);
    }

    const imageSource = previewUrl ?? roomType?.image_url ?? null;

    return (
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-5 overflow-y-auto px-6 pb-6">
                <div className="space-y-2">
                    <Label htmlFor="name">
                        Room type name{' '}
                        <span className="text-destructive">*</span>
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
                        placeholder="Describe the room type, its view, and included amenities."
                        disabled={form.processing}
                    />
                    <InputError message={form.errors.description} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="image">
                        Room type image{' '}
                        {!roomType && (
                            <span className="text-destructive">*</span>
                        )}
                    </Label>

                    <div className="flex items-center gap-3 rounded-2xl border bg-muted/30 p-3">
                        {imageSource ? (
                            <img
                                src={imageSource}
                                alt={
                                    roomType
                                        ? `${roomType.name} room type`
                                        : 'Room type preview'
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
                                {roomType
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
                        : roomType
                          ? 'Save changes'
                          : 'Add room type'}
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

export default function RoomTypes({ roomTypes, summary }: RoomTypesPageProps) {
    const [search, setSearch] = useState('');
    const [sheetOpen, setSheetOpen] = useState(false);
    const [editingRoomType, setEditingRoomType] =
        useState<AdminRoomType | null>(null);
    const [pendingDelete, setPendingDelete] = useState<AdminRoomType | null>(
        null,
    );
    const [deleting, setDeleting] = useState(false);

    const filteredRoomTypes = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (query === '') {
            return roomTypes;
        }

        return roomTypes.filter((roomType) =>
            roomType.name.toLowerCase().includes(query),
        );
    }, [roomTypes, search]);

    function openCreateSheet() {
        setEditingRoomType(null);
        setSheetOpen(true);
    }

    function openEditSheet(roomType: AdminRoomType) {
        setEditingRoomType(roomType);
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
                toast.success(`${pendingDelete.name} room type was deleted.`);
                setPendingDelete(null);
            },
            onError: () => {
                toast.error('The room type could not be deleted.');
            },
            onFinish: () => {
                setDeleting(false);
            },
        });
    }

    const blockedByRelations =
        (pendingDelete?.rooms_count ?? 0) > 0 ||
        (pendingDelete?.bookings_count ?? 0) > 0;

    return (
        <>
            <Head title="Room type management" />

            <div className="flex h-full flex-1 flex-col gap-5 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="font-serif text-3xl">Room types</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage the room type catalogue. Physical room units
                            are managed on the Rooms page.
                        </p>
                    </div>

                    <Button onClick={openCreateSheet}>
                        <Plus />
                        Add room type
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <StatCard
                        label="Total room types"
                        value={summary.totalRoomTypes.toLocaleString('id-ID')}
                        description="Room types available in the catalogue."
                        icon={BedDouble}
                    />
                    <StatCard
                        label="Physical rooms"
                        value={summary.totalRooms.toLocaleString('id-ID')}
                        description="Physical units across every room type."
                        icon={DoorOpen}
                    />
                    <StatCard
                        label="Total bookings"
                        value={summary.totalBookings.toLocaleString('id-ID')}
                        description={`${summary.bookedRoomTypes.toLocaleString('id-ID')} room type${summary.bookedRoomTypes === 1 ? '' : 's'} with bookings.`}
                        icon={CalendarCheck}
                    />
                </div>

                <Card className="overflow-hidden pb-0">
                    <CardHeader className="gap-4">
                        <div>
                            <CardTitle>Room type catalogue</CardTitle>
                            <CardDescription>
                                Each room type shows its nightly rate, physical
                                unit count, and reservation activity.
                            </CardDescription>
                        </div>

                        <div className="relative w-full md:max-w-sm">
                            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search room types..."
                                className="pl-9"
                            />
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        {filteredRoomTypes.length > 0 ? (
                            <Table className="rounded-none border-0">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Room type</TableHead>
                                        <TableHead>Price / night</TableHead>
                                        <TableHead>Rooms</TableHead>
                                        <TableHead>Bookings</TableHead>
                                        <TableHead>Revenue</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-right" />
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {filteredRoomTypes.map((roomType) => (
                                        <TableRow key={roomType.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <RoomImage
                                                        src={roomType.image_url}
                                                        alt={`${roomType.name} room type`}
                                                        className="size-11 shrink-0 rounded-xl object-cover"
                                                    />
                                                    <div>
                                                        <div className="font-medium">
                                                            {roomType.name}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {roomType.bookings_count >
                                                            0
                                                                ? `Booked ${roomType.bookings_count} time${roomType.bookings_count === 1 ? '' : 's'}`
                                                                : 'No bookings yet'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell className="font-medium">
                                                {formatCurrency(roomType.price)}
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        roomType.rooms_count > 0
                                                            ? 'secondary'
                                                            : 'outline'
                                                    }
                                                >
                                                    <DoorOpen />
                                                    {roomType.rooms_count.toLocaleString(
                                                        'id-ID',
                                                    )}
                                                </Badge>
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        roomType.bookings_count >
                                                        0
                                                            ? 'secondary'
                                                            : 'outline'
                                                    }
                                                >
                                                    {roomType.bookings_count.toLocaleString(
                                                        'id-ID',
                                                    )}
                                                </Badge>
                                            </TableCell>

                                            <TableCell>
                                                {formatCurrency(
                                                    roomType.bookings_revenue,
                                                )}
                                            </TableCell>

                                            <TableCell className="max-w-xs">
                                                <p className="line-clamp-2 text-sm text-muted-foreground">
                                                    {roomType.description}
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
                                                                    roomType,
                                                                )
                                                            }
                                                        >
                                                            <Pencil />
                                                            Edit room type
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            variant="destructive"
                                                            onClick={() =>
                                                                setPendingDelete(
                                                                    roomType,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 />
                                                            Delete room type
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
                                <p className="font-medium">
                                    No room types found.
                                </p>
                                <p className="max-w-sm text-sm text-muted-foreground">
                                    {search !== ''
                                        ? 'Try a different search term.'
                                        : 'Add the first room type to start accepting bookings.'}
                                </p>
                                {search === '' && (
                                    <Button
                                        variant="outline"
                                        onClick={openCreateSheet}
                                        className="mt-2"
                                    >
                                        <Plus />
                                        Add room type
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
                            {editingRoomType
                                ? 'Edit room type'
                                : 'Add a room type'}
                        </SheetTitle>
                        <SheetDescription>
                            {editingRoomType
                                ? 'Update the room type details below. Changes are visible to guests immediately.'
                                : 'Fill in the room type details to add it to the catalogue.'}
                        </SheetDescription>
                    </SheetHeader>

                    <RoomTypeForm
                        key={`${sheetOpen ? 'open' : 'closed'}-${editingRoomType?.id ?? 'new'}`}
                        roomType={editingRoomType}
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
                        <AlertDialogTitle>
                            Delete this room type?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {blockedByRelations ? (
                                <>
                                    <strong>{pendingDelete?.name}</strong> still
                                    has {pendingDelete?.rooms_count} physical
                                    room
                                    {pendingDelete?.rooms_count === 1
                                        ? ''
                                        : 's'}{' '}
                                    and {pendingDelete?.bookings_count} booking
                                    {pendingDelete?.bookings_count === 1
                                        ? ''
                                        : 's'}
                                    . Remove those before deleting this room
                                    type.
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
                            disabled={deleting || blockedByRelations}
                        >
                            {deleting ? 'Deleting...' : 'Delete room type'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

RoomTypes.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Room types',
            href: roomTypesIndex(),
        },
    ],
};
