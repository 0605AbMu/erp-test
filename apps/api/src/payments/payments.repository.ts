import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service.js';
import { QueryDto } from '../common/dto/query.dto.js';
import { PaymentRow } from '@erp-test/shared';

@Injectable()
export class PaymentsRepository {
  constructor(
    private readonly db: DbService,
  ) { }

  async findAll(query: QueryDto<PaymentRow>) {

    console.log(query);

    let conditions = [];

    if (query.filters?.method && Array.isArray(query.filters.method)) {
      conditions.push(`method in (${query.filters.method.map(x => `'${x}'`).join(', ')})`);
    }

    if (query.filters?.status && Array.isArray(query.filters.status)) {
      conditions.push(`status in (${query.filters.status.map(x => `'${x}'`).join(', ')})`);
    }

    if (query.filters?.paid_at && Array.isArray(query.filters.paid_at) && query.filters.paid_at.length == 2) {
      conditions.push(`paid_at BETWEEN to_timestamp(${query.filters.paid_at[0]}) AND to_timestamp(${query.filters.paid_at[1]})`);
    }

    // if (query.filters?.name && Array.isArray(query.filters.name)) {
    //   conditions.push(`name ILIKE '${query.filters.name[0]}'`);
    // }


    return (await this.db.queryWithPaging(
      `SELECT * FROM payments
        ${conditions.length ? `WHERE ` + conditions.join(' AND ') : ''}
      `,
      query));
  }
}