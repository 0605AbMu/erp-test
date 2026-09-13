import { Query } from "@erp-test/shared";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from 'class-transformer';
import { Allow, IsNumber, IsOptional, IsString, Matches, Max, Min } from "class-validator";
import { safeFilterValuesRegex } from "@erp-test/shared";
import { BadRequestException } from "@nestjs/common";

export class QueryDto<T = any> implements Omit<Query, 'filters'> {
    @ApiPropertyOptional({ minimum: 1, default: 1 })
    @IsNumber()
    @Min(1)
    @IsOptional()
    page: number = 1;

    @ApiPropertyOptional({ default: 10 })
    @IsNumber()
    @Min(0)
    @Max(100, { message: 'Hajm 100 dan oshmasligi kerak' })
    @IsOptional()
    size: number = 10;

    @ApiPropertyOptional({ description: 'Saralash uchun maydon nomi' })
    @IsString()
    @Matches(/^[a-zA-Z_][a-zA-Z0-9_]*$/)
    @IsOptional()
    order?: string = "id";

    @ApiPropertyOptional({ description: 'Saralash yo‘nalishi' })
    @IsString()
    @IsOptional()
    desc?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value !== 'string') {
            return value;
        }

        try {
            const parsed = JSON.parse(value) as Record<any, any[]>;
            const invalid = Object.values(parsed)
                .some(x => {
                    if (typeof x === 'string')
                        if (!safeFilterValuesRegex.test(x))
                            return true
                    return false;
                })

            if (invalid)
                throw new BadRequestException('Filtr qiymati noto‘g‘ri');

            return parsed;

        } catch {
            return undefined;
        }
    })
    filters?: Record<keyof T, any[]>;
}