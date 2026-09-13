import { ApiProperty, OmitType } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { nameRegex, passwordRegex } from "@erp-test/shared";

export class CreateUserDto {
    @ApiProperty({ example: "John", description: "User first name" })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    @Matches(nameRegex)
    name: string;

    @ApiProperty({ example: "Doe", description: "User last name" })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    @Matches(nameRegex)
    surname: string;

    @ApiProperty({ example: "john.doe@example.com", description: "User email" })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: "P@ssw0rd", description: "Foydalanuvchi paroli" })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @Matches(passwordRegex)
    password: string;
}

export class UpdateUserDto extends OmitType(CreateUserDto, ['email', 'password']) {
    @ApiProperty()
    @IsBoolean()
    is_active: boolean;
}