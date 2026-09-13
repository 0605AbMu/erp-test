import { ApiProperty } from "@nestjs/swagger";
import { AuthBaseDto } from "./base.dto.js";
import { IsString } from "class-validator";

export class RegisterDto extends AuthBaseDto {
  @ApiProperty(
    {example: "John", description: "Ism"}
  )
  @IsString()
  name!: string;

  @ApiProperty(
    {example: "Doe", description: "Surname"}
  )
  @IsString()
  surname!: string;

}