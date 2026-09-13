import { ApiProperty } from "@nestjs/swagger";
import { AuthBaseDto } from "./base.dto.js";
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { nameRegex } from "@erp-test/shared";

export class RegisterDto extends AuthBaseDto {
  @ApiProperty(
    {example: "John", description: "Ism"}
  )
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  @Matches(nameRegex)
  name!: string;

  @ApiProperty(
    {example: "Doe", description: "Surname"}
  )
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  @Matches(nameRegex)
  surname!: string;

}