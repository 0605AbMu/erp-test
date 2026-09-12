import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { getFakeReports } from './entities/report.entity.js';
import { DbService } from '../db/db.service.js';
import { QueryDto } from '../common/dto/query.dto.js';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);
  constructor(private readonly db: DbService) { }

  findAll(query: QueryDto) {
    return this.db.queryWithPaging(`SELECT * FROM reports`, query);
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  async fillWithMock(userId: number, count: number) {
    if (count > 100)
      throw new BadRequestException("Max 100 items are allowed");

    const reports = Array.from({ length: count }, () => getFakeReports(userId));

    const inserted = await this.db.batchInsert('reports', reports);

    this.logger.log('Mock data inserted', { inserted });
  }
}
