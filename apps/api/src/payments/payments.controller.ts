import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service.js';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { UpdatePaymentDto } from './dto/update-payment.dto.js';
import { Authorization } from '../common/decorators/authorization.decorator.js';
import { Roles } from '@erp-test/shared';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import type { AuthorizedUser } from '../common/types/authorized-user.js';
import { ApiQuery } from '@nestjs/swagger';
import { PaymentsRepository } from './payments.repository.js';
import { QueryDto } from '../common/dto/query.dto.js';

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

  @Post('mock')
  @ApiQuery({
    name: 'count',
    type: 'number',
    description: 'mock item count'
  })
  fillWithMock(@Query('count') count: number, @CurrentUser() user: AuthorizedUser) {
    return this.paymentsService.fillWithMock(user.id, count);
  }

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  // @ApiQuery({ type: QueryDto })
  findAll(@Query() query: QueryDto) {
    return this.paymentRepository.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(+id);
  }


}
