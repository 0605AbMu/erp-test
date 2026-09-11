import { ApiProperty } from "@nestjs/swagger";
import { AuthBaseDto } from "./base.dto.js";

export class RegisterDto extends AuthBaseDto {
  @ApiProperty(
    {example: "John Doe", description: "User full name"}
  )
  name!: string;
}