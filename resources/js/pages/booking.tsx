import { Banknote, Landmark, Wallet, MapPin, ReceiptText, ShoppingBag, ArrowRight, BedDouble } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Struktur data item dinamis dari backend/props
export interface CheckoutItem {
    id?: number;
    product_size_id?: number;
    nama: string;
    Varian?: string;
    Harga: number;
    qty?: number;
    quantity?: number;
    Foto?: string | null;
}

interface Props {
    initialItems?: CheckoutItem[];
    source?: string;
}

const paymentMethods = [
    { value: "transfer", label: "Transfer Bank", icon: Landmark },
    { value: "e-wallet", label: "E-Wallet/QRIS", icon: Wallet },
    { value: "cod", label: "Cash on Delivery", icon: Banknote },
] as const;

type PaymentMethod = (typeof paymentMethods)[number]["value"];

// Helper Format Rupiah
const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(angka);
};

// Komponen Card Item Dinamis
function ProductCard({ nama, Varian, Harga, qty, quantity, Foto }: CheckoutItem) {
    const totalQty = qty ?? quantity ?? 1;
    return (
        <div className="flex gap-4 w-full items-center">
            <div className="h-14 w-14 shrink-0 rounded-xl border border-border bg-muted/30 flex items-center justify-center overflow-hidden">
                {Foto ? (
                    <img src={Foto.startsWith('http') ? Foto : `/storage/${Foto}`} alt={nama} className="h-full w-full object-cover" />
                ) : (
                    <ShoppingBag className="h-5 w-5 text-muted-foreground/50" />
                )}
            </div>
            <div className="flex flex-col flex-1 justify-center min-w-0">
                <h5 className="text-sm font-semibold text-foreground truncate">
                    {nama} {Varian ? `(${Varian})` : ''}
                </h5>
                <span className="text-xs text-muted-foreground mt-0.5">
                    {totalQty} Pcs | {formatRupiah(Harga)}
                </span>
            </div>
            <div className="flex flex-col justify-center items-end shrink-0">
                <span className="text-sm font-bold text-foreground">
                    {formatRupiah(Harga * totalQty)}
                </span>
            </div>
        </div>
    );
}

// Komponen Utama
export default function BookingForm({}: Props) {
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("transfer");

    return (
        <div className="relative max-w-7xl mx-auto flex flex-col gap-6 px-5 py-10">
            <div>
                <h1 className="text-3xl font-medium tracking-tight text-foreground">Room Booking</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Please fill in your details and select a payment method to complete your booking.
                </p>
            </div>

            <form className="grid gap-4 items-start">

                {/* Form Kiri */}
                <div className="flex flex-col gap-5">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <BedDouble className="w-5 h-5 text-muted-foreground" />
                                Booking Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Fullname <span className="text-destructive">*</span></Label>
                                    <Input id="name" name="name" autoComplete="name" placeholder="Budi Santoso" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">No. WhatsApp <span className="text-destructive">*</span></Label>
                                    <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="081234567890" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Alamat Lengkap <span className="text-destructive">*</span></Label>
                                <Textarea
                                    id="address"
                                    name="address"
                                    placeholder="Nama Jalan, RT/RW, Kelurahan, Kecamatan, Kota, Kode Pos..."
                                    rows={3}
                                    className="resize-none"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="note">Catatan Tambahan (Opsional)</Label>
                                <Input id="note" name="note" placeholder="Contoh: Patokan rumah warna pagar hitam" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-muted-foreground" />
                                Payment Method
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {paymentMethods.map(({ value, label, icon: Icon }) => (
                                    <label
                                        key={value}
                                        className={`relative flex flex-col items-center justify-center p-5 rounded-xl border cursor-pointer transition-all ${paymentMethod === value
                                            ? "border-primary bg-primary/5 text-primary"
                                            : "border-border hover:bg-muted/50 text-muted-foreground"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value={value}
                                            checked={paymentMethod === value}
                                            onChange={() => setPaymentMethod(value)}
                                            className="sr-only"
                                        />
                                        <Icon className={`w-6 h-6 mb-2 ${paymentMethod === value ? "text-primary" : ""}`} />
                                        <span className="text-xs font-semibold text-center">{label}</span>

                                        {paymentMethod === value && (
                                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
                                        )}
                                    </label>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    );
}