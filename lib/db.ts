import postgres from 'postgres';

let client: ReturnType<typeof postgres> | null = null;
let ready: Promise<void> | null = null;

export function db() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error('DATABASE_URL is not configured');
  if (!client) client = postgres(url, { ssl: 'require', max: 1 });
  return client;
}

export async function ensureSchema() {
  if (!ready) {
    ready = (async () => {
      const sql = db();
      await sql`
        CREATE TABLE IF NOT EXISTS piratas_activities (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT NOT NULL DEFAULT '',
          activity_date TIMESTAMPTZ NOT NULL,
          location TEXT NOT NULL DEFAULT '',
          event_password TEXT NOT NULL DEFAULT '',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`ALTER TABLE piratas_activities ADD COLUMN IF NOT EXISTS event_password TEXT NOT NULL DEFAULT ''`;
      await sql`
        CREATE TABLE IF NOT EXISTS piratas_attendance (
          id SERIAL PRIMARY KEY,
          activity_id INTEGER NOT NULL REFERENCES piratas_activities(id) ON DELETE CASCADE,
          member_name TEXT NOT NULL,
          status TEXT NOT NULL CHECK (status IN ('presente', 'talvez', 'ausente')),
          note TEXT NOT NULL DEFAULT '',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          UNIQUE(activity_id, member_name)
        )
      `;
    })();
  }
  return ready;
}
