import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service.js';
import { QueryDto } from '../common/dto/query.dto.js';

@Injectable()
export class PaymentsRepository {
  constructor(
    private readonly db: DbService,
  ) { }

  async findAll(query: QueryDto) {
    return (await this.db.queryWithPaging('payments', query, ['id', 'user_id', 'amount', 'currency', 'status', 'method', 'transaction_id', 'description', 'paid_at', 'created_at', 'updated_at']));
  }
}