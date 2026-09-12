import { Roles } from '@erp-test/shared';
import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Authorization } from '../common/decorators/authorization.decorator.js';
import { ReportsService } from './reports.service.js';
import { ApiQuery } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import type { AuthorizedUser } from '../common/types/authorized-user.js';
import { QueryDto } from '../common/dto/query.dto.js';

@Controller({
  path: 'reports',
  version: '1'
})
@Authorization(Roles.REPORT)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) { }

  @Get()
  findAll(@Query() query: QueryDto) {
    return this.reportsService.findAll(query);
  }
  @Post('mock')
  @ApiQuery({
    name: 'count',
    type: 'number',
    description: 'mock item count'
  })
  fillWithMock(@Query('count') count: number, @CurrentUser() user: AuthorizedUser) {
    return this.reportsService.fillWithMock(user.id, count);
  }
}
