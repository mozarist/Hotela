import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    BedDouble,
    CalendarDays,
    CheckCircle2,
    Coffee,
    Download,
    IdCard,
    ReceiptText,
    UserRound,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import RoomImage from '@/components/hotel/room-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    bookingReference,
    formatCurrency,
    formatDate,
    formatDateTime,
} from '@/lib/format';
import { booking as bookingRoute, home } from '@/routes';
import type { BookingInvoice } from '@/types/hotel';

function DetailRow({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof UserRound;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted">
                <Icon className="size-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
                <p className="text-xs tracking-wide text-muted-foreground">
                    {label}
                </p>
                <p className="wrap-break-words mt-0.5 text-sm font-medium">
                    {value}
                </p>
            </div>
        </div>
    );
}

export default function BookingSummary({
    booking,
}: {
    booking: BookingInvoice;
}) {
    function downloadInvoice() {
        window.print();
    }

    return (
        <>
            <Head title={`Booking ${bookingReference(booking.id)}`} />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 md:py-14 print:block print:max-w-none print:p-0">
                <Link
                    href={home.url()}
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground print:hidden"
                >
                    <ArrowLeft className="size-4" />
                    Back to home
                </Link>

                <div className="space-y-2 print:hidden">
                    <h1 className="mt-3 font-serif text-4xl md:text-5xl">
                        Booking confirmed.
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Your stay is reserved. Keep this invoice for your
                        records.
                    </p>
                </div>

                <Card
                    id="booking-invoice"
                    className="overflow-hidden print:hidden"
                >
                    <CardHeader className="border-b">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <AppLogo />
                            <div className="text-left sm:text-right">
                                <p className="text-xs tracking-wide text-muted-foreground">
                                    Invoice
                                </p>
                                <p className="font-mono text-sm font-semibold">
                                    {bookingReference(booking.id)}
                                </p>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    Issued {formatDateTime(booking.created_at)}
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="grid gap-6 md:grid-cols-[240px_minmax(0,1fr)]">
                            <RoomImage
                                src={booking.room_type.image_url}
                                alt={`${booking.room_type.name} room`}
                                className="h-44 w-full rounded-2xl object-cover md:h-full"
                            />

                            <div className="space-y-6">
                                <div>
                                    <h2 className="mt-1 font-serif text-3xl">
                                        {booking.room_type.name} Room
                                    </h2>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                        {booking.room_type.description}
                                    </p>
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <DetailRow
                                        icon={UserRound}
                                        label="Guest"
                                        value={`${booking.guest_name} (${booking.gender})`}
                                    />
                                    <DetailRow
                                        icon={IdCard}
                                        label="Identity number"
                                        value={booking.identity_number}
                                    />
                                    <DetailRow
                                        icon={CalendarDays}
                                        label="Check-in"
                                        value={formatDate(booking.booking_date)}
                                    />
                                    <DetailRow
                                        icon={BedDouble}
                                        label="Length of stay"
                                        value={`${booking.duration_days} night${booking.duration_days === 1 ? '' : 's'}`}
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-3">
                                <h3 className="flex items-center gap-2 font-medium">
                                    <Coffee className="size-4 text-muted-foreground" />
                                    Additional services
                                </h3>
                                <div className="rounded-2xl border bg-muted/20 p-4 text-sm">
                                    <div className="flex items-center justify-between gap-4">
                                        <span>Breakfast</span>
                                        <Badge
                                            variant={
                                                booking.includes_breakfast
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                        >
                                            {booking.includes_breakfast
                                                ? 'Included'
                                                : 'Not included'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="flex items-center gap-2 font-medium">
                                    <ReceiptText className="size-4 text-muted-foreground" />
                                    Payment breakdown
                                </h3>
                                <div className="space-y-2.5 rounded-2xl border p-4 text-sm">
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-muted-foreground">
                                            {formatCurrency(
                                                booking.room_type.price,
                                            )}{' '}
                                            × {booking.duration_days} night
                                            {booking.duration_days === 1
                                                ? ''
                                                : 's'}
                                        </span>
                                        <span>
                                            {formatCurrency(booking.subtotal)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-muted-foreground">
                                            Long-stay discount
                                        </span>
                                        <span className="text-emerald-600 dark:text-emerald-400">
                                            -
                                            {formatCurrency(
                                                booking.discount_amount,
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-muted-foreground">
                                            Breakfast
                                        </span>
                                        <span>
                                            {booking.breakfast_fee > 0
                                                ? formatCurrency(
                                                      booking.breakfast_fee,
                                                  )
                                                : '-'}
                                        </span>
                                    </div>
                                    <Separator className="my-1" />
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="font-medium">
                                            Total payment
                                        </span>
                                        <span className="font-serif text-xl">
                                            {formatCurrency(
                                                booking.total_payment,
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {booking.discount_amount > 0 && (
                            <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                <CheckCircle2 className="mr-1.5 inline size-4" />
                                You saved{' '}
                                {formatCurrency(booking.discount_amount)} with
                                our long-stay rate.
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="invoice-ticket hidden print:block">
                    <div className="invoice-ticket__header flex flex-col items-center gap-2">
                        <AppLogo />
                        <p className="invoice-ticket__subtitle">
                            Your booking has been confirmed successfully
                        </p>
                    </div>

                    <div className="invoice-ticket__body">
                        <div className="invoice-ticket__dash" />

                        <div className="invoice-ticket__summary">
                            <div>
                                <p className="invoice-ticket__label">
                                    INVOICE ID
                                </p>
                                <p className="invoice-ticket__value font-mono">
                                    {bookingReference(booking.id)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="invoice-ticket__label">TOTAL</p>
                                <p className="invoice-ticket__value">
                                    {formatCurrency(booking.total_payment)}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <p className="invoice-ticket__label">DATE & TIME</p>
                            <p className="invoice-ticket__value">
                                {formatDateTime(booking.created_at)}
                            </p>
                        </div>

                        <div className="invoice-ticket__guest mt-6">
                            <div>
                                <p className="font-semibold">
                                    {booking.guest_name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {booking.room_type.name} Room ·{' '}
                                    {booking.duration_days} night
                                    {booking.duration_days === 1 ? '' : 's'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-2 border-t border-dashed border-gray-300 pt-4 text-sm">
                            <div className="flex justify-between gap-4">
                                <span className="text-gray-500">Check-in</span>
                                <span className="font-medium">
                                    {formatDate(booking.booking_date)}
                                </span>
                            </div>
                            <div className="flex justify-between gap-4">
                                <span className="text-gray-500">Breakfast</span>
                                <span className="font-medium">
                                    {booking.includes_breakfast
                                        ? formatCurrency(booking.breakfast_fee)
                                        : 'Not included'}
                                </span>
                            </div>
                            <div className="flex justify-between gap-4 border-t border-gray-200 pt-2 font-semibold">
                                <span>Total payment</span>
                                <span>
                                    {formatCurrency(booking.total_payment)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="invoice-ticket__barcode" aria-hidden="true">
                        <div className="invoice-ticket__bars" />
                        <span>{bookingReference(booking.id)}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end print:hidden">
                    <Button variant="outline" onClick={downloadInvoice}>
                        <Download />
                        Download invoice
                    </Button>
                    <Button asChild>
                        <Link href={bookingRoute.url()}>
                            <BedDouble />
                            Book another stay
                        </Link>
                    </Button>
                </div>
            </div>
        </>
    );
}
