export enum Roles {
  ADMIN = "admin",
  PAYMENT = "payment",
  REPORT = "report"
}

export type Role = (typeof Roles)[keyof typeof Roles];
