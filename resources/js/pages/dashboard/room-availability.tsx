import { Head, router } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import {
    BedDouble,
    CheckCircle2,
    DoorOpen,
    Sparkles,
    Wrench,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { index as roomsIndex } from '@/routes/dashboard/rooms';
import { update as updateStatus } from '@/routes/dashboard/rooms/status';
import type { RoomStatus, RoomUnit } from '@/types/hotel';

type RoomAvailabilityPageProps = {
    rooms: RoomUnit[];
    roomTypes: Array<{ id: number; name: string }>;
    statuses: Array<{ value: RoomStatus; label: string }>;
    summary: {
        total: number;
        available: number;
        occupied: number;
        cleaning: number;
        maintenance: number;
    };
};

type StatusStyle = {
    label: string;
    badge: string;
    dot: string;
    card: string;
    option: string;
    icon: LucideIcon;
};

const statusStyles: Record<RoomStatus, StatusStyle> = {
    available: {
        label: 'Available',
        badge: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300',
        dot: 'bg-emerald-500',
        card: 'hover:border-emerald-300 dark:hover:border-emerald-800',
        option: 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200',
        icon: CheckCircle2,
    },
    occupied: {
        label: 'Occupied',
        badge: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300',
        dot: 'bg-rose-500',
        card: 'hover:border-rose-300 dark:hover:border-rose-800',
        option: 'border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200',
        icon: BedDouble,
    },
    cleaning: {
        label: 'Cleaning',
        badge: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300',
        dot: 'bg-amber-500',
        card: 'hover:border-amber-300 dark:hover:border-amber-800',
        option: 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200',
        icon: Sparkles,
    },
    maintenance: {
        label: 'Maintenance',
        badge: 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300',
        dot: 'bg-slate-400',
        card: 'hover:border-slate-300 dark:hover:border-slate-700',
        option: 'border-slate-300 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-200',
        icon: Wrench,
    },
};

const statusTone: Record<RoomStatus, string> = {
    available: 'text-emerald-600 dark:text-emerald-400',
    occupied: 'text-rose-600 dark:text-rose-400',
    cleaning: 'text-amber-600 dark:text-amber-400',
    maintenance: 'text-slate-500 dark:text-slate-400',
};

function SummaryCard({
    label,
    value,
    description,
    icon: Icon,
    tone,
}: {
    label: string;
    value: string;
    description: string;
    icon: LucideIcon;
    tone: string;
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                <div>
                    <CardDescription>{label}</CardDescription>
                    <CardTitle
                        className={cn(
                            'mt-1 font-serif text-3xl tabular-nums',
                            tone,
                        )}
                    >
                        {value}
                    </CardTitle>
                </div>
                <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
                    <Icon className={cn('size-5', tone)} />
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}

export default function RoomAvailability({
    rooms,
    roomTypes,
    statuses,
    summary,
}: RoomAvailabilityPageProps) {
    const [roomTypeFilter, setRoomTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedRoom, setSelectedRoom] = useState<RoomUnit | null>(null);
    const [nextStatus, setNextStatus] = useState<RoomStatus>('available');
    const [saving, setSaving] = useState(false);

    const filteredRooms = useMemo(() => {
        return rooms.filter((room) => {
            const matchesRoomType =
                roomTypeFilter === 'all' ||
                room.room_type.id === Number(roomTypeFilter);
            const matchesStatus =
                statusFilter === 'all' || room.status === statusFilter;

            return matchesRoomType && matchesStatus;
        });
    }, [rooms, roomTypeFilter, statusFilter]);

    function openRoom(room: RoomUnit) {
        setSelectedRoom(room);
        setNextStatus(room.status);
    }

    function closeDialog() {
        if (saving) {
            return;
        }

        setSelectedRoom(null);
    }

    function saveStatus() {
        if (!selectedRoom) {
            return;
        }

        setSaving(true);

        router.patch(
            updateStatus.url(selectedRoom.id),
            { status: nextStatus },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        `Room ${selectedRoom.room_number} is now ${statusStyles[nextStatus].label}.`,
                    );
                    setSelectedRoom(null);
                },
                onError: () => {
                    toast.error('The room status could not be updated.');
                },
                onFinish: () => {
                    setSaving(false);
                },
            },
        );
    }

    const hasFilters = roomTypeFilter !== 'all' || statusFilter !== 'all';

    function resetFilters() {
        setRoomTypeFilter('all');
        setStatusFilter('all');
    }

    return (
        <>
            <Head title="Room availability" />

            <div className="flex h-full flex-1 flex-col gap-5 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="font-serif text-3xl">
                            Room availability
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Monitor every physical room and update its
                            operational status instantly.
                        </p>
                    </div>

                    <Badge variant="outline" className="h-auto px-3 py-1.5">
                        <DoorOpen />
                        {filteredRooms.length} of {summary.total} rooms shown
                    </Badge>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard
                        label="Total rooms"
                        value={summary.total.toLocaleString('id-ID')}
                        description="All physical rooms in the hotel."
                        icon={DoorOpen}
                        tone="text-foreground"
                    />
                    <SummaryCard
                        label="Available"
                        value={summary.available.toLocaleString('id-ID')}
                        description="Ready to be assigned to a guest."
                        icon={CheckCircle2}
                        tone={statusTone.available}
                    />
                    <SummaryCard
                        label="Occupied"
                        value={summary.occupied.toLocaleString('id-ID')}
                        description="Currently checked in or reserved."
                        icon={BedDouble}
                        tone={statusTone.occupied}
                    />
                    <SummaryCard
                        label="Cleaning / Maintenance"
                        value={(
                            summary.cleaning + summary.maintenance
                        ).toLocaleString('id-ID')}
                        description={`${summary.cleaning} cleaning, ${summary.maintenance} maintenance.`}
                        icon={Wrench}
                        tone={statusTone.cleaning}
                    />
                </div>

                <Card>
                    <CardHeader className="gap-4">
                        <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                            <div>
                                <CardTitle>Room grid</CardTitle>
                                <CardDescription>
                                    Click a room to change its status. Colors
                                    reflect the current operational state.
                                </CardDescription>
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row">
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="room-type-filter"
                                        className="text-xs text-muted-foreground"
                                    >
                                        Room type
                                    </Label>
                                    <Select
                                        value={roomTypeFilter}
                                        onValueChange={setRoomTypeFilter}
                                    >
                                        <SelectTrigger
                                            id="room-type-filter"
                                            className="w-full sm:w-44"
                                        >
                                            <SelectValue placeholder="All room types" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All room types
                                            </SelectItem>
                                            {roomTypes.map((roomType) => (
                                                <SelectItem
                                                    key={roomType.id}
                                                    value={String(roomType.id)}
                                                >
                                                    {roomType.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="status-filter"
                                        className="text-xs text-muted-foreground"
                                    >
                                        Status
                                    </Label>
                                    <Select
                                        value={statusFilter}
                                        onValueChange={setStatusFilter}
                                    >
                                        <SelectTrigger
                                            id="status-filter"
                                            className="w-full sm:w-40"
                                        >
                                            <SelectValue placeholder="All statuses" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All statuses
                                            </SelectItem>
                                            {statuses.map((status) => (
                                                <SelectItem
                                                    key={status.value}
                                                    value={status.value}
                                                >
                                                    {status.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {filteredRooms.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
                                {filteredRooms.map((room) => {
                                    const style = statusStyles[room.status];

                                    return (
                                        <button
                                            key={room.id}
                                            type="button"
                                            onClick={() => openRoom(room)}
                                            className={cn(
                                                'group flex flex-col items-start gap-3 rounded-2xl border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none',
                                                style.card,
                                            )}
                                        >
                                            <div className="flex w-full items-start justify-between gap-2">
                                                <span className="font-serif text-3xl leading-none tabular-nums">
                                                    {room.room_number}
                                                </span>
                                                <span
                                                    className={cn(
                                                        'mt-1 size-2.5 shrink-0 rounded-full',
                                                        style.dot,
                                                    )}
                                                />
                                            </div>
                                            <span className="w-full truncate text-xs text-muted-foreground">
                                                {room.room_type.name}
                                            </span>
                                            <Badge
                                                variant="outline"
                                                className={style.badge}
                                            >
                                                {style.label}
                                            </Badge>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
                                <DoorOpen className="size-10 text-muted-foreground/60" />
                                <p className="font-medium">No rooms found.</p>
                                <p className="max-w-sm text-sm text-muted-foreground">
                                    No physical rooms match the selected
                                    filters.
                                </p>
                                {hasFilters && (
                                    <Button
                                        variant="outline"
                                        onClick={resetFilters}
                                        className="mt-2"
                                    >
                                        Reset filters
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog
                open={selectedRoom !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        closeDialog();
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Room {selectedRoom?.room_number}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedRoom?.room_type.name} · Update the
                            operational status for this room.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 py-2">
                        <Label>Status</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {statuses.map((status) => {
                                const style = statusStyles[status.value];
                                const Icon = style.icon;
                                const isSelected = nextStatus === status.value;

                                return (
                                    <button
                                        key={status.value}
                                        type="button"
                                        onClick={() =>
                                            setNextStatus(status.value)
                                        }
                                        disabled={saving}
                                        className={cn(
                                            'flex items-center gap-2 rounded-xl border p-3 text-left text-sm font-medium transition-colors disabled:opacity-60',
                                            isSelected
                                                ? style.option
                                                : 'border-border bg-input/30 hover:bg-input/50',
                                        )}
                                    >
                                        <Icon className="size-4" />
                                        {status.label}
                                        {isSelected && (
                                            <CheckCircle2 className="ml-auto size-4" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={closeDialog}
                            disabled={saving}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={saveStatus}
                            disabled={
                                saving || nextStatus === selectedRoom?.status
                            }
                        >
                            {saving ? 'Saving...' : 'Update status'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

RoomAvailability.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Room availability',
            href: roomsIndex(),
        },
    ],
};
