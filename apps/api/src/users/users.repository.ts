import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service.js';

@Injectable()
export class UserRepository {
  constructor(
    private readonly db: DbService,
  ) {}

  
}