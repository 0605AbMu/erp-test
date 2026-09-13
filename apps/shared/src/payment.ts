export enum Currency {
    UZS = "UZS",
    USD = "USD",
    RUB = "RUB"
}

export enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed",
    REFUNDED = "refunded"
}

export enum PaymentMethod {
    CASH = 'cash',
    CARD = 'card'
}

export interface PaymentRow {
    id: number;
    user_id: number;
    amount: number;
    currency: Currency;
    status: PaymentStatus;
    method: string;
    transaction_id?: string;
    description?: string;
    paid_at?: Date;
    created_at?: Date;
    updated_at?: Date;
}