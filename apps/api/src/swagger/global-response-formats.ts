export const swaggerResponseFormats = [
    {
        status: 'default',
        schema: {
            type: 'object',
            properties: {
                success: {
                    type: 'boolean',
                    example: true
                },
                statusCode: {
                    type: 'number',
                    example: 200
                },
                data: {
                    type: 'object',
                    examples: {}
                }
            }
        }
    },
    {
        status: '4XX',
        description: '',
        schema: {
            type: 'object',
            properties: {
                success: {
                    type: 'boolean',
                    example: false
                },
                statusCode: {
                    type: 'number',
                    example: 400
                },
                error: {
                    type: 'object',
                    properties: {
                        code: {},
                        message: {},
                        details: {
                            nullable: true
                        }
                    }
                }
            }
        }
    },
    {
        status: '5XX',
        description: '',
        schema: {
            type: 'object',
            properties: {
                success: {
                    type: 'boolean',
                    example: false
                },
                statusCode: {
                    type: 'number',
                    example: 500
                },
                error: {
                    type: 'object',
                    properties: {
                        code: {},
                        message: {},
                        details: {
                            nullable: true
                        }
                    }
                }
            }
        }
    }
]