export type RoomType = {
    id: number;
    name: string;
    price: number;
    description: string;
    image_url: string | null;
};

export type AdminRoomType = RoomType & {
    rooms_count: number;
    bookings_count: number;
    bookings_revenue: number;
};

export type RoomStatus = 'available' | 'occupied' | 'cleaning' | 'maintenance';

export type RoomUnit = {
    id: number;
    room_number: string;
    status: RoomStatus;
    room_type: {
        id: number;
        name: string;
    };
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
    room_type: RoomType;
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
    room_type: {
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
