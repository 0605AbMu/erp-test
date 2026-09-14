import { kv } from '@vercel/kv';

export class VercelKvStore {
  opts = {};
  namespace?: string;

  async get(key: string): Promise<string | undefined> {
    const raw = await kv.get<string>(key);
    if (raw === null || raw === undefined) {
      return undefined;
    }
    return typeof raw === 'string' ? raw : JSON.stringify(raw);
  }

  async set(key: string, value: any, ttl?: number): Promise<boolean> {
    const str = typeof value === 'string' ? value : JSON.stringify(value);
    if (ttl && ttl > 0) {
      await kv.set(key, str, { px: ttl });
    } else {
      await kv.set(key, str);
    }
    return true;
  }

  async delete(key: string): Promise<boolean> {
    const count = await kv.del(key);
    return count > 0;
  }

  async clear(): Promise<void> {
    await kv.flushall();
  }

  async has(key: string): Promise<boolean> {
    const count = await kv.exists(key);
    return count > 0;
  }
}
