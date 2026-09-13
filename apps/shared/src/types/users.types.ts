export type UserRowShort = {
    id: number;
    name: string;
    surname: string;
    email: string;
    is_active: boolean;
}
export type UserRow = UserRowShort & {
    created_at: Date;
    updated_at: Date;
    roles: {
        role_id: number;
        name: string;
    }[],
    created_by_id: number;
    updated_by_id: number;
}

export type UserRowFull = UserRow & {
    password_hash: string;
}