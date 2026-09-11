import 'dotenv/config';
import { execSync } from 'node:child_process';
import { Client } from 'pg';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined');
}

async function createDatabase() {
  const url = new URL(databaseUrl as string);

  const databaseName = url.pathname.slice(1);

  if (!databaseName) {
    throw new Error('Database name is missing in DATABASE_URL');
  }

  url.pathname = '/postgres';

  const client = new Client({
    connectionString: url.toString(),
  });

  await client.connect();

  try {
    const result = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [databaseName],
    );

    if (result.rowCount === 0) {
      await client.query(`CREATE DATABASE "${databaseName}"`);
      console.log(`Database "${databaseName}" created`);
    } else {
      console.log(`Database "${databaseName}" already exists`);
    }
  } finally {
    await client.end();
  }
}

async function run() {
  await createDatabase();

  console.log('Running migrations...');
  execSync('pnpm db:up', {
    stdio: 'inherit',
  });

  console.log('Running seeds...');
  execSync('pnpm db:seed', {
    stdio: 'inherit',
  });

  console.log('Database setup completed');
}

run().catch((error) => {
  console.error('Database setup failed:', error);
  process.exit(1);
});