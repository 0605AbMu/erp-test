import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service.js';
import { QueryDto } from '../common/dto/query.dto.js';

@Injectable()
export class ReportsRepository {
  constructor(
    private readonly db: DbService,
  ) { }

  findAll(query: QueryDto) {
    return this.db.queryWithPaging(`SELECT * FROM reports`, query);
  }
}