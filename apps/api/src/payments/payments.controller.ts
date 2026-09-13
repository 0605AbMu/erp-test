import { Roles } from '@erp-test/shared';
import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { Authorization } from '../common/decorators/authorization.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { QueryDto } from '../common/dto/query.dto.js';
import type { AuthorizedUser } from '../common/types/authorized-user.js';
import { PaymentsRepository } from './payments.repository.js';
import { PaymentsService } from './payments.service.js';

@Controller({
  path: 'payments',
  version: '1'
})
@Authorization(Roles.PAYMENT)
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly paymentRepository: PaymentsRepository
  ) { }

  @Authorization(Roles.ADMIN)
  @Post('mock')
  @ApiQuery({
    name: 'count',
    type: 'number',
    description: 'mock item count'
  })
  fillWithMock(@Query('count') count: number, @CurrentUser() user: AuthorizedUser) {
    return this.paymentsService.fillWithMock(user.id, count);
  }

  @Get()
  // @ApiQuery({ type: QueryDto })
  findAll(@Query() query: QueryDto) {
    return this.paymentRepository.findAll(query);
  }
}
