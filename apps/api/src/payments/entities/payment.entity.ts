import { Currency, PaymentMethod, PaymentStatus } from "@erp-test/shared"
import { faker } from "@faker-js/faker";
import { OmitType } from "@nestjs/swagger";
export class Payment {
    id: number;
    user_id: number;
    amount: number;
    currency: Currency;
    status: PaymentStatus;
    method: PaymentMethod;
    transaction_id?: string;
    description: string;
    paid_at?: Date;
    created_at: Date;
    updated_at: Date;
}

export class PaymentInsert extends OmitType(Payment, ['created_at', 'id']){};

export const getFakePayment = (userId: number): PaymentInsert => {
    return {
        amount: faker.number.float(),
        currency: faker.helpers.enumValue(Currency),
        description: faker.finance.transactionDescription(),
        method: faker.helpers.enumValue(PaymentMethod),
        status: faker.helpers.enumValue(PaymentStatus),
        updated_at: faker.date.future(),
        user_id: userId, //set explicitly,
        paid_at: faker.date.future(),
        transaction_id: faker.string.uuid()
    }
}
