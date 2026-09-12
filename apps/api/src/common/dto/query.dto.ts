import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, IsString, Max, MIN, Min } from "class-validator";

export class QueryDto {
    @ApiPropertyOptional({ minimum: 1, default: 1 })
    @IsNumber()
    @Min(1)
    @IsOptional()
    page: number = 1;

    @ApiPropertyOptional({ default: 10 })
    @IsNumber()
    @Min(0)
    @Max(100, {message: 'max size is 100'})
    @IsOptional()
    size: number = 10;

    @ApiPropertyOptional({ description: 'property name for order' })
    @IsString()
    @IsOptional()
    order?: string = "id";

    @ApiPropertyOptional({ description: 'to use send token' })
    @IsString()
    @IsOptional()
    desc?: string;
}