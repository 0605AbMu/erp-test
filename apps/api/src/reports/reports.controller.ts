import { Roles } from '@erp-test/shared';
import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { Authorization } from '../common/decorators/authorization.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { QueryDto } from '../common/dto/query.dto.js';
import type { AuthorizedUser } from '../common/types/authorized-user.js';
import { ReportsRepository } from './reports.repository.js';
import { ReportsService } from './reports.service.js';

@Controller({
  path: 'reports',
  version: '1'
})
@Authorization(Roles.REPORT)
export class ReportsController {
  constructor(
    private readonly reportsRepository: ReportsRepository,
    private readonly reportsService: ReportsService

  ) { }

  @Get()
  findAll(@Query() query: QueryDto) {
    return this.reportsRepository.findAll(query);
  }

  @Authorization(Roles.ADMIN)
  @Post('mock')
  @ApiQuery({
    name: 'count',
    type: 'number',
    description: 'mock item count',
    required: true
  })
  fillWithMock(@Query('count') count: number, @CurrentUser() user: AuthorizedUser) {
    return this.reportsService.fillWithMock(user.id, count);
  }
}
