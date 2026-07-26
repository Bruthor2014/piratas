import { NextResponse } from 'next/server';
import { db, ensureSchema } from '@/lib/db';

export async function POST(request: Request) {
  const form = await request.formData();
  const activityId = Number(form.get('activityId'));
  const memberName = String(form.get('memberName') || '').trim();
  const status = String(form.get('status') || 'presente');
  const note = String(form.get('note') || '').trim();
  const eventPassword = String(form.get('eventPassword') || '').trim();

  if (!activityId || !memberName || !['presente', 'talvez', 'ausente'].includes(status)) {
    return NextResponse.redirect(new URL('/?erro=presenca', request.url));
  }

  await ensureSchema();
  const rows = await db()`SELECT event_password FROM piratas_activities WHERE id = ${activityId} LIMIT 1`;
  const expected = String(rows[0]?.event_password || '');
  if (expected && eventPassword !== expected) {
    return NextResponse.redirect(new URL('/?erro=password', request.url));
  }

  await db()`
    INSERT INTO piratas_attendance (activity_id, member_name, status, note)
    VALUES (${activityId}, ${memberName}, ${status}, ${note})
    ON CONFLICT (activity_id, member_name)
    DO UPDATE SET status = EXCLUDED.status, note = EXCLUDED.note, created_at = NOW()
  `;

  return NextResponse.redirect(new URL('/?ok=presenca', request.url));
}
