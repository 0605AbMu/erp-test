export enum Roles {
  ADMIN = "admin",
  USER = "user",
  PAYMENT = "payment",
  REPORT = "report"
}

export type Role = (typeof Roles)[keyof typeof Roles];
