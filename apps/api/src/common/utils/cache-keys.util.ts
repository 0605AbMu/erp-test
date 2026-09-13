export function authTokenVersionKey(userId: number) {
    return `auth:users:${userId}:token_version`;
}