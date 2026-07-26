import Image from 'next/image';
import { PageHero, PageShell } from '../components/Shell';

export default function Tabaco() {
  return (
    <PageShell>
      <section className="container section">
        <article className="card image-card">
          <Image
            src="/precario.png"
            alt="Preçário de tabaco Los Piratas"
            width={600}
            height={600}
            className="price-image"
            priority
          />
        </article>
      </section>
    </PageShell>
  );
}
