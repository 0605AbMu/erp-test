//To use jwt payloaded user data
export interface AuthorizedUser {
    id: number;
    exp: number;
    roles: string[]
}