import { Roles } from '@erp-test/shared';
import { Controller, Get, Param } from '@nestjs/common';
import { Authorization } from '../common/decorators/authorization.decorator.js';
import { ReportsService } from './reports.service.js';

@Controller('reports')
@Authorization(Roles.REPORT)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(+id);
  }
}
