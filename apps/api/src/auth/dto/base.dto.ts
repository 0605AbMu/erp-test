import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, Matches } from "class-validator";
import { passwordRegex } from "@erp-test/shared";

export class AuthBaseDto {
  @ApiProperty(
    {example: "test@mail.com", description: "Foydalanuvchining elektron pochta manzili"}
  )
  @IsEmail()
  email!: string;

  @ApiProperty(
    {example: "password123", description: "Foydalanuvchi paroli"}
  )
  @Matches(passwordRegex)
  password!: string;
}