import { Head, Link, useForm } from '@inertiajs/react';
import {
    BedDouble,
    CalendarDays,
    Check,
    Coffee,
    IdCard,
    ReceiptText,
    Sparkles,
    UserRound,
} from 'lucide-react';
import { toast } from 'sonner';
import RoomImage from '@/components/hotel/room-image';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { formatCurrency } from '@/lib/format';
import { store } from '@/routes/bookings';
import type { Room } from '@/types/hotel';

type BookingFormData = {
    room_id: number | '';
    guest_name: string;
    gender: 'Laki-laki' | 'Perempuan';
    identity_number: string;
    booking_date: string;
    duration_days: number | '';
    includes_breakfast: boolean;
};

type BookingPageProps = {
    rooms: Room[];
    selectedRoomId: number | null;
    breakfastFee: number;
    discountRate: number;
    minDiscountDuration: number;
};

function todayIso(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export default function Booking({
    rooms,
    selectedRoomId,
    breakfastFee,
    discountRate,
    minDiscountDuration,
}: BookingPageProps) {
    const initialRoom =
        rooms.find((room) => room.id === selectedRoomId) ?? rooms[0] ?? null;

    const form = useForm<BookingFormData>({
        room_id: initialRoom?.id ?? '',
        guest_name: '',
        gender: 'Laki-laki',
        identity_number: '',
        booking_date: todayIso(),
        duration_days: 1,
        includes_breakfast: false,
    });

    const selectedRoom =
        rooms.find((room) => room.id === Number(form.data.room_id)) ?? null;
    const durationDays = Number(form.data.duration_days) || 0;
    const subtotal = selectedRoom ? selectedRoom.price * durationDays : 0;
    const includesDiscount = durationDays > minDiscountDuration;
    const discountAmount = includesDiscount
        ? Math.round(subtotal * discountRate)
        : 0;
    const selectedBreakfastFee = form.data.includes_breakfast
        ? breakfastFee
        : 0;
    const totalPayment = Math.max(
        0,
        subtotal - discountAmount + selectedBreakfastFee,
    );

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.post(store.url(), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Booking confirmed. Your invoice is ready.');
            },
            onError: () => {
                toast.error(
                    'Please check the highlighted fields and try again.',
                );
            },
        });
    }

    return (
        <>
            <Head title="Book your stay" />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 md:py-14">
                <div className="max-w-2xl">
                    <p className="text-xs font-semibold tracking-[0.24em] text-muted-foreground uppercase">
                        Reserve your stay
                    </p>
                    <h1 className="mt-2 font-serif text-4xl md:text-5xl">
                        A few details, then relax.
                    </h1>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                        Choose a room, set your dates, and see your total update
                        instantly. We confirm the final invoice on our server
                        before saving your booking.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]"
                >
                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BedDouble className="size-5 text-muted-foreground" />
                                    Choose your room
                                </CardTitle>
                                <CardDescription>
                                    Every room includes Wi-Fi, daily
                                    housekeeping, and access to all hotel
                                    facilities.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="room_id">
                                        Room type{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Select
                                        value={
                                            form.data.room_id
                                                ? String(form.data.room_id)
                                                : ''
                                        }
                                        onValueChange={(value) =>
                                            form.setData(
                                                'room_id',
                                                Number(value),
                                            )
                                        }
                                        disabled={form.processing}
                                    >
                                        <SelectTrigger
                                            id="room_id"
                                            className="w-full"
                                        >
                                            <SelectValue placeholder="Select a room" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {rooms.map((room) => (
                                                <SelectItem
                                                    key={room.id}
                                                    value={String(room.id)}
                                                >
                                                    {room.name} ·{' '}
                                                    {formatCurrency(room.price)}{' '}
                                                    / night
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={form.errors.room_id} />
                                </div>

                                {selectedRoom && (
                                    <div className="flex gap-4 rounded-2xl border bg-muted/30 p-3">
                                        <RoomImage
                                            src={selectedRoom.image_url}
                                            alt={`${selectedRoom.name} room`}
                                            className="h-24 w-28 shrink-0 rounded-xl object-cover"
                                        />
                                        <div className="flex min-w-0 flex-col justify-center">
                                            <div className="flex items-center gap-2">
                                                <h3 className="truncate font-medium">
                                                    {selectedRoom.name} Room
                                                </h3>
                                                <Badge variant="secondary">
                                                    <Sparkles />
                                                    Featured
                                                </Badge>
                                            </div>
                                            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                                {selectedRoom.description}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="guest_name">
                                            Full name{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <div className="relative">
                                            <UserRound className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                id="guest_name"
                                                value={form.data.guest_name}
                                                onChange={(event) =>
                                                    form.setData(
                                                        'guest_name',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Budi Santoso"
                                                autoComplete="name"
                                                className="pl-9"
                                                disabled={form.processing}
                                            />
                                        </div>
                                        <InputError
                                            message={form.errors.guest_name}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="gender">
                                            Gender{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={form.data.gender}
                                            onValueChange={(value) =>
                                                form.setData(
                                                    'gender',
                                                    value as BookingFormData['gender'],
                                                )
                                            }
                                            disabled={form.processing}
                                        >
                                            <SelectTrigger
                                                id="gender"
                                                className="w-full"
                                            >
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Laki-laki">
                                                    Laki-laki
                                                </SelectItem>
                                                <SelectItem value="Perempuan">
                                                    Perempuan
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={form.errors.gender}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between gap-3">
                                        <Label htmlFor="identity_number">
                                            Identity number{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <span className="text-xs text-muted-foreground">
                                            {form.data.identity_number.length}
                                            /16
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <IdCard className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="identity_number"
                                            value={form.data.identity_number}
                                            onChange={(event) =>
                                                form.setData(
                                                    'identity_number',
                                                    event.target.value
                                                        .replace(/\D/g, '')
                                                        .slice(0, 16),
                                                )
                                            }
                                            inputMode="numeric"
                                            maxLength={16}
                                            placeholder="16 digit identity number"
                                            className="pl-9"
                                            disabled={form.processing}
                                        />
                                    </div>
                                    <InputError
                                        message={form.errors.identity_number}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CalendarDays className="size-5 text-muted-foreground" />
                                    Stay details
                                </CardTitle>
                                <CardDescription>
                                    Long stays earn an automatic 10% discount
                                    after the third night.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-5">
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="booking_date">
                                            Check-in date{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="booking_date"
                                            type="date"
                                            min={todayIso()}
                                            value={form.data.booking_date}
                                            onChange={(event) =>
                                                form.setData(
                                                    'booking_date',
                                                    event.target.value,
                                                )
                                            }
                                            disabled={form.processing}
                                        />
                                        <InputError
                                            message={form.errors.booking_date}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="duration_days">
                                            Nights{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="duration_days"
                                            type="number"
                                            min={1}
                                            max={365}
                                            step={1}
                                            value={form.data.duration_days}
                                            onChange={(event) =>
                                                form.setData(
                                                    'duration_days',
                                                    event.target.value === ''
                                                        ? ''
                                                        : Number(
                                                              event.target
                                                                  .value,
                                                          ),
                                                )
                                            }
                                            disabled={form.processing}
                                        />
                                        <InputError
                                            message={form.errors.duration_days}
                                        />
                                    </div>
                                </div>

                                <label
                                    htmlFor="includes_breakfast"
                                    className="flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors hover:bg-muted/40"
                                >
                                    <Checkbox
                                        id="includes_breakfast"
                                        checked={form.data.includes_breakfast}
                                        onCheckedChange={(checked) =>
                                            form.setData(
                                                'includes_breakfast',
                                                checked === true,
                                            )
                                        }
                                        disabled={form.processing}
                                    />
                                    <div className="flex-1">
                                        <span className="flex items-center gap-2 text-sm font-medium">
                                            <Coffee className="size-4 text-muted-foreground" />
                                            Include breakfast
                                        </span>
                                        <span className="mt-1 block text-xs text-muted-foreground">
                                            A flat{' '}
                                            {formatCurrency(breakfastFee)} per
                                            booking, added after any discount.
                                        </span>
                                    </div>
                                    {form.data.includes_breakfast && (
                                        <Check className="size-4 text-primary" />
                                    )}
                                </label>
                                <InputError
                                    message={form.errors.includes_breakfast}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="lg:sticky lg:top-24">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ReceiptText className="size-5 text-muted-foreground" />
                                Your estimate
                            </CardTitle>
                            <CardDescription>
                                Live preview. The final amount is recalculated
                                securely when you submit.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="rounded-2xl bg-muted/50 p-4">
                                <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                                    Total payment
                                </p>
                                <p className="mt-1 font-serif text-4xl">
                                    {formatCurrency(totalPayment)}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {durationDays} night
                                    {durationDays === 1 ? '' : 's'} ·{' '}
                                    {selectedRoom?.name ?? 'No room selected'}
                                </p>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-muted-foreground">
                                        Room rate
                                    </span>
                                    <span>
                                        {selectedRoom
                                            ? `${formatCurrency(selectedRoom.price)} × ${durationDays}`
                                            : '-'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-muted-foreground">
                                        Subtotal
                                    </span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <span className="flex items-center gap-1.5 text-muted-foreground">
                                        Long-stay discount
                                        {includesDiscount && (
                                            <Badge
                                                variant="secondary"
                                                className="h-4 px-1.5 text-[10px]"
                                            >
                                                10%
                                            </Badge>
                                        )}
                                    </span>
                                    <span
                                        className={
                                            discountAmount > 0
                                                ? 'font-medium text-emerald-600 dark:text-emerald-400'
                                                : ''
                                        }
                                    >
                                        -{formatCurrency(discountAmount)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <span className="flex items-center gap-1.5 text-muted-foreground">
                                        <Coffee className="size-3.5" />
                                        Breakfast
                                    </span>
                                    <span>
                                        {selectedBreakfastFee > 0
                                            ? formatCurrency(
                                                  selectedBreakfastFee,
                                              )
                                            : 'Not included'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-3 border-t pt-4 text-base font-semibold">
                                <span>Total</span>
                                <span className="font-serif text-2xl">
                                    {formatCurrency(totalPayment)}
                                </span>
                            </div>

                            {includesDiscount && (
                                <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                    <Check className="mr-1 inline size-3.5" />
                                    You save {formatCurrency(discountAmount)} on
                                    this stay.
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                disabled={form.processing || !selectedRoom}
                            >
                                {form.processing
                                    ? 'Creating booking...'
                                    : 'Confirm booking'}
                            </Button>

                            <p className="text-center text-xs text-muted-foreground">
                                No payment is taken online. Our team will
                                contact you after confirmation.
                            </p>
                        </CardContent>
                    </Card>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                    Need to look around first?{' '}
                    <Link
                        href="/#rooms"
                        className="underline underline-offset-4"
                    >
                        Browse all rooms
                    </Link>
                </p>
            </div>
        </>
    );
}
