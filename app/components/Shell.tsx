import Image from 'next/image';
import Link from 'next/link';

const links = [
  ['/', 'Início'],
  ['/tabaco', 'Preçário Tabaco'],
  ['/armas', 'Preçário Armas'],
  ['/admin', 'Admin']
];

export function Header() {
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <Link className="brand" href="/">
          <Image src="/logo-piratas.svg" alt="Logo Los Piratas" width={58} height={58} priority />
          <span><b>Los Piratas</b><small>portal RP</small></span>
        </Link>
        <div className="nav-links">{links.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}</div>
      </div>
    </nav>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return <><Header />{children}<footer className="footer"><div className="container">Los Piratas • atividades e preçários</div></footer></>;
}

export function PageHero({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <section className="page-hero">
      <div className="container title-card">
        <Image src="/logo-piratas.svg" alt="Los Piratas" width={130} height={130} />
        <div>
          <span className="badge">{eyebrow}</span>
          <h1>{title}</h1>
          <p className="lead">{children}</p>
        </div>
      </div>
    </section>
  );
}
