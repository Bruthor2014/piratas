export const dynamic = 'force-dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { PageShell } from './components/Shell';
import { db, ensureSchema } from '@/lib/db';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
type Activity = { id: number; title: string; description: string; location: string; activity_date: string; attendees: { member_name: string; status: string; note: string }[] };

async function getActivities(): Promise<Activity[]> {
  try {
    await ensureSchema();
    const rows = await db()`
      SELECT a.id,a.title,a.description,a.location,a.activity_date,
      COALESCE(json_agg(json_build_object('member_name',t.member_name,'status',t.status,'note',t.note) ORDER BY t.created_at) FILTER (WHERE t.id IS NOT NULL),'[]') AS attendees
      FROM piratas_activities a
      LEFT JOIN piratas_attendance t ON t.activity_id=a.id
      WHERE a.activity_date >= NOW() - INTERVAL '1 day'
      GROUP BY a.id
      ORDER BY a.activity_date ASC
    `;
    return rows as unknown as Activity[];
  } catch { return []; }
}

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const activities = await getActivities();
  return <PageShell>
    <main className="container hero">
      <div className="hero-grid">
        <section>
          <span className="badge">Organização RP</span>
          <h1>Los Piratas</h1>
          <p className="lead">Portal interno para atividades e presenças. Cada evento tem uma palavra-passe definida pelo admin para impedir marcações de pessoas de fora.</p>
          <div className="actions"><Link className="btn" href="/tabaco">Preçário Tabaco</Link><Link className="btn secondary" href="/armas">Preçário Armas</Link></div>
        </section>
        <aside className="card skull-card"><Image src="/logo-piratas.svg.png" alt="Logo Los Piratas" width={260} height={260} priority /><h3>Atividades protegidas</h3><p className="small">Só marca presença quem souber a senha do evento.</p></aside>
      </div>
    </main>
    <section className="container section">
      <h2>Atividades do dia</h2>
      {params.ok && <p className="success">Presença guardada.</p>}
      {params.erro === 'password' && <p className="error">Palavra-passe do evento incorreta.</p>}
      {params.erro === 'presenca' && <p className="error">Confirma os dados da presença.</p>}
      <div className="activities"><div>{activities.length === 0 ? <div className="card"><h3>Nenhuma atividade marcada</h3><p>Quando criares uma atividade no painel admin, ela aparece aqui.</p></div> : activities.map(a => <article className="card" key={a.id}><h3>{a.title}</h3><p>{new Date(a.activity_date).toLocaleString('pt-PT')} • {a.location || 'Local a definir'}</p><p>{a.description}</p><form className="form" action="/api/attendance" method="post"><input type="hidden" name="activityId" value={a.id} /><div className="row"><input required name="memberName" placeholder="Nome do membro" /><select name="status" defaultValue="presente"><option value="presente">Presente</option><option value="talvez">Talvez</option><option value="ausente">Ausente</option></select></div><input required name="eventPassword" type="password" placeholder="Palavra-passe do evento" /><input name="note" placeholder="Nota opcional" /><button type="submit">Guardar presença</button></form><div>{a.attendees.map(x => <span className="pill" key={x.member_name}>{x.member_name} • {x.status}</span>)}</div></article>)}</div><aside className="card"><Link className="btn secondary" href="/admin">Painel admin</Link></aside></div>
    </section>
  </PageShell>;
}
