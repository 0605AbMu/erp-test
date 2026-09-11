import 'dotenv/config';
import { Pool } from 'pg';
import { seedRoles } from './001-init.js';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

try {
  await seedRoles(pool);
  
  console.log('Seeds completed successfully');
} finally {
  await pool.end();
}