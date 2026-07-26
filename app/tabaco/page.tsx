import Image from 'next/image';
import { PageHero, PageShell } from '../components/Shell';

export default function Tabaco() {
  return (
    <PageShell>
      <PageHero title="Preçário Tabaco" eyebrow="Tabela de venda">
        Consulta interna do preçário de tabaco da organização.
      </PageHero>
      <section className="container section">
        <article className="card image-card">
          <Image
            src="/precario.png"
            alt="Preçário de tabaco Los Piratas"
            width={1600}
            height={1000}
            className="price-image"
            priority
          />
        </article>
      </section>
    </PageShell>
  );
}
