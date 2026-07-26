import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { db, ensureSchema } from '@/lib/db';
export async function GET(){await ensureSchema();const activities=await db()`SELECT id,title,description,location,activity_date,created_at FROM piratas_activities ORDER BY activity_date ASC`;return NextResponse.json({activities})}
export async function POST(request:Request){if(!(await isAdmin()))return NextResponse.json({error:'Unauthorized'},{status:401});const body=await request.json();await ensureSchema();const [activity]=await db()`INSERT INTO piratas_activities (title, description, location, activity_date, event_password) VALUES (${body.title}, ${body.description||''}, ${body.location||''}, ${body.activityDate}, ${body.eventPassword||''}) RETURNING id,title,description,location,activity_date,created_at`;return NextResponse.json({activity})}
