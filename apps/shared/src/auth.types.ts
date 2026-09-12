import { UserRow } from "./users.types.js";

export type UserRoles = {
    user_id: number;
    role_id: number;
    name: string;
}

export type UserResponse = UserRow;