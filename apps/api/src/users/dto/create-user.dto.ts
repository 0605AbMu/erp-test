import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches, Max, MaxLength, MinLength,  } from "class-validator";
import { passwordRegex } from "../../common/utils/regex.util.js";

export class CreateUserDto {
    @ApiProperty({example: "John", description: "User first name"})
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    name: string;

    @ApiProperty({example: "Doe", description: "User last name"})
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    surname: string;

    @ApiProperty({example: "john.doe@example.com", description: "User email"})
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({example: "P@ssw0rd", description: "User password"})
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @Matches(passwordRegex)
    password: string;
}