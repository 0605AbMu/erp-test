import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { UpdatePaymentDto } from './dto/update-payment.dto.js';
import { getFakePayment, Payment } from './entities/payment.entity.js';
import { DbService } from '../db/db.service.js';
import { faker } from "@faker-js/faker";
import { Currency } from '@erp-test/shared';
import { BadRequest } from '../common/exceptions/bad-request.exception.js';

@Injectable()
export class PaymentsService {

  constructor(private readonly db: DbService) { }

  create(createPaymentDto: CreatePaymentDto) {
    return 'This action adds a new payment';
  }

  findAll() {
    return `This action returns all payments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }

  async fillWithMock(userId: number, count: number) {
    if (count > 100)
      throw new BadRequestException("Max 100 items are allowed");

    const payments = Array.from({ length: count }, () => getFakePayment(userId));

    await this.db.batchInsert('payments', payments);
  }
}
