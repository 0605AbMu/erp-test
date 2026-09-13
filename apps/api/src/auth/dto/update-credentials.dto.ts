import { IsNumber } from "class-validator";
import { AuthBaseDto } from "./base.dto.js";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCredentialsDto extends AuthBaseDto {
    @ApiProperty({ description: "updating user id" })
    @IsNumber()
    userId: number;
}