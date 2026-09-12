import { Query } from "@erp-test/shared";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsAlphanumeric, IsNumber, IsOptional, IsString, Matches, Max, Min } from "class-validator";

export class QueryDto implements Query {
    @ApiPropertyOptional({ minimum: 1, default: 1 })
    @IsNumber()
    @Min(1)
    @IsOptional()
    page: number = 1;

    @ApiPropertyOptional({ default: 10 })
    @IsNumber()
    @Min(0)
    @Max(100, { message: 'max size is 100' })
    @IsOptional()
    size: number = 10;

    @ApiPropertyOptional({ description: 'property name for order' })
    @IsString()
    @Matches(/^[a-zA-Z_][a-zA-Z0-9_]*$/)
    @IsOptional()
    order?: string = "id";

    @ApiPropertyOptional({ description: 'to use send token' })
    @IsString()
    @IsOptional()
    desc?: string;
}