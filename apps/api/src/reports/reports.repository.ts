import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service.js';
import { QueryDto } from '../common/dto/query.dto.js';
import { ReportRow } from '@erp-test/shared';

@Injectable()
export class ReportsRepository {
  constructor(
    private readonly db: DbService,
  ) { }

  findAll(query: QueryDto<ReportRow>) {

    let conditions = [];

    if (query.filters?.status && Array.isArray(query.filters.status)) {
      conditions.push(`status in (${query.filters.status.map(x => `'${x}'`).join(', ')})`);
    }

    if (query.filters?.type && Array.isArray(query.filters.type)) {
      conditions.push(`type ILIKE '${query.filters.type[0]}'`);
    }

    if (query.filters?.name && Array.isArray(query.filters.name)) {
      conditions.push(`name ILIKE '$${query.filters.name[0]}%'`);
    }

    return this.db.queryWithPaging(`SELECT * FROM reports
      ${conditions.length ? `WHERE ` + conditions.join(' AND ') : ''}
      `, query);
  }
}