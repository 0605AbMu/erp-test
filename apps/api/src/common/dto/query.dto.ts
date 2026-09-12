import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class QueryDto {
    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    page: number = 1;
    
    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    size: number = 10;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    order?: string = "id";

    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
    descending?: boolean = false;
}