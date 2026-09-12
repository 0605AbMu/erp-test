import { Global, Module } from '@nestjs/common';
import { DbService } from './db.service.js';
import { types } from 'pg';

types.setTypeParser(20, (value) => Number(value));

@Global()
@Module({
  providers: [DbService],
  exports: [DbService],
})
export class DbModule {}