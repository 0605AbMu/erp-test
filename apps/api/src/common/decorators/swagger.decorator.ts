import { applyDecorators, Type } from '@nestjs/common';
import {
    ApiExtraModels,
    ApiOkResponse,
    getSchemaPath,
} from '@nestjs/swagger';

export function ApiResponse<TModel extends Type<unknown>>(
    model: TModel,
) {
    return applyDecorators(
        ApiExtraModels(model),

        ApiOkResponse({
            schema: {
                properties: {
                    data: {
                        $ref: getSchemaPath(model),
                    },
                    message: {
                        type: 'string',
                        example: 'Muvaffaqiyatli',
                    },
                },
            },
        }),
    );
}