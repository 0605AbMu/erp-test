import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Pool, QueryResultRow } from 'pg';
import { ConfigService } from '../config/config.service.js';
import { QueryDto } from '../common/dto/query.dto.js';

@Injectable()
export class DbService implements OnModuleDestroy {
  private readonly pool: Pool;
  private readonly logger = new Logger(DbService.name);

  constructor(private readonly config: ConfigService) {
    this.pool = new Pool({
      connectionString: this.config.databaseUrl,
    });
  }

  query<T extends QueryResultRow = any>(
    text: string,
    values?: unknown[],
  ) {
    return this.pool.query<T>(text, values);
  }

  async queryWithPaging<T extends QueryResultRow = any>(query: string, queryDto: QueryDto) {

    this.logger.debug(queryDto);

    const rawQuery = `
    SELECT * FROM (
    ${query}
    )
    ORDER BY ${queryDto.order ?? "id"} ${queryDto.desc ? 'DESC' : ''}
    OFFSET $1
    LIMIT $2
    `
    const totalQuery = `SELECT COUNT(id) as count FROM (${query})`;

    this.logger.debug(rawQuery);
    this.logger.debug(totalQuery);

    const page = (await this.query<T>(rawQuery, [(queryDto.page - 1) * queryDto.size, queryDto.size])).rows;
    const total = (await this.query(totalQuery)).rows[0]?.count ?? 0;
    
    return {
      items: page,
      total: total
    }
  }

  async batchInsert(tableName: string, values: {}[]) {
    if (values.length == 0)
      return;

    const item0 = values[0];
    const objectLength = Object.keys(item0).length;

    const valuesQuery = Array.from({ length: values.length }, (v, kroot) => {
      return '(' + Array.from({ length: objectLength }, (v, k) => `$${kroot * objectLength + k + 1}`).join(", ") + ')'
    }).join(',\n');

    const rawValues = values.flatMap(x => Object.values(x));

    const columns = Object.keys(item0);

    const rawQuery = `
WITH inserted_rows AS (
        INSERT INTO ${tableName} (
        ${columns.join(', ')}
        )
        VALUES 
        ${valuesQuery} 
RETURNING *
          )
SELECT COUNT(*) as count FROM inserted_rows;
      `;

    this.logger.debug(rawQuery);

    const result = await this.query(rawQuery, rawValues);
    return result.rows[0]?.count;
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}