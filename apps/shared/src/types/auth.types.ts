import { UserRow } from "./users.types.js";

export type UserRoles = {
    user_id: number;
    role_id: number;
    name: string;
}

export type UserResponse = UserRow;

export interface Session {
    id: string;
    user_id: number;
    refresh_token_hash: string;
    expires_at: Date;
    revoked_at?: Date;
    created_at: Date;
    last_used_at: Date;
    user_agent?: string;
    ip?: string;
}