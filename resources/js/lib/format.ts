const currencyFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

export function formatCurrency(amount: number): string {
    return currencyFormatter.format(amount);
}

export function formatDate(value: string): string {
    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'long',
    }).format(new Date(`${value}T00:00:00`));
}

export function formatDateTime(value: string | null): string {
    if (!value) {
        return '-';
    }

    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}

export function bookingReference(id: number): string {
    return `HTL-${String(id).padStart(5, '0')}`;
}
