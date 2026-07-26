import Image from 'next/image';
import { PageHero, PageShell } from '../components/Shell';

export default function Armas() {
  return (
    <PageShell>
      <PageHero title="Preçário Armas" eyebrow="Tabela interna">
        Consulta interna do preçário de armas, carregadores e proteção.
      </PageHero>
      <section className="container section">
        <article className="card image-card">
          <Image
            src="/armas.png"
            alt="Preçário de armas Los Piratas"
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
