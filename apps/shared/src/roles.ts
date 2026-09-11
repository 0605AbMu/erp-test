export enum Roles {
  ADMIN = "admin",
  MANAGER = "manager",
  USER = "user",
}

export type Role = (typeof Roles)[keyof typeof Roles];
