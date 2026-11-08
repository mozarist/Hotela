export type Room = {
    id: number;
    name: string;
    price: number;
    description: string;
    image_url: string | null;
};

export type BookingInvoice = {
    id: number;
    guest_name: string;
    gender: string;
    identity_number: string;
    booking_date: string;
    duration_days: number;
    includes_breakfast: boolean;
    discount_amount: number;
    total_payment: number;
    created_at: string | null;
    subtotal: number;
    breakfast_fee: number;
    room: Room;
};

export type DashboardBooking = {
    id: number;
    guest_name: string;
    gender: string;
    identity_number: string;
    booking_date: string;
    duration_days: number;
    includes_breakfast: boolean;
    discount_amount: number;
    total_payment: number;
    created_at: string | null;
    room: {
        id: number;
        name: string;
        price: number;
    };
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};
