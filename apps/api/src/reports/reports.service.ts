import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportsService {
  findAll() {
    return `This action returns all reports`;
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  async addMock(){
    
  }
}
