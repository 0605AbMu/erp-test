import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { DbService } from '../db/db.service.js';
import { getFakePayment } from './entities/payment.entity.js';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(private readonly db: DbService) { }

  async fillWithMock(userId: number, count: number) {
    if (count > 100)
      throw new BadRequestException("Max 100 items are allowed");

    const payments = Array.from({ length: count }, () => getFakePayment(userId));

    const inserted = await this.db.batchInsert('payments', payments);

    this.logger.log('Mock data inserted', { inserted });
  }
}
