import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, Matches } from "class-validator";
import { passwordRegex } from "../../common/utils/regex.util.js";

export class AuthBaseDto {
  @ApiProperty(
    {example: "test@mail.com", description: "User email address"}
  )
  @IsEmail()
  email!: string;

  @ApiProperty(
    {example: "password123", description: "User password"}
  )
  @Matches(passwordRegex)
  password!: string;
}