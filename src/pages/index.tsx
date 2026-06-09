import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const areas = [
  {
    emoji: '🧩',
    title: 'Microservicios',
    desc: 'Fundamentos de arquitectura distribuida, descomposición y comunicación entre servicios.',
    to: '/docs/microservices/intro',
  },
  {
    emoji: '🔌',
    title: 'APIs',
    desc: 'Diseño REST, contratos, versionamiento y buenas prácticas de integración.',
    to: '/docs/apis/rest-design',
  },
  {
    emoji: '📐',
    title: 'Patrones',
    desc: 'SOLID, patrones de diseño GoF y patrones de resiliencia para sistemas distribuidos.',
    to: '/docs/patterns/solid',
  },
  {
    emoji: '📋',
    title: 'ADRs',
    desc: 'Architecture Decision Records que documentan las decisiones técnicas del proyecto.',
    to: '/docs/adrs/template',
  },
];

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <header className={`hero hero--primary ${styles.heroBanner}`}>
        <div className="container">
          <Heading as="h1" className="hero__title">{siteConfig.title}</Heading>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link className="button button--secondary button--lg" to="/docs/intro">
              Explorar documentación →
            </Link>
            <Link
              className="button button--outline button--secondary button--lg"
              to="/docs/adrs/adr-001-rag-stack"
              style={{marginLeft: '1rem'}}>
              Ver ADRs
            </Link>
          </div>
        </div>
      </header>
      <main>
        <section style={{padding: '3rem 0'}}>
          <div className="container">
            <div className="row">
              {areas.map(({emoji, title, desc, to}) => (
                <div key={title} className="col col--3 margin-bottom--lg">
                  <Link to={to} style={{textDecoration: 'none', color: 'inherit'}}>
                    <div className="card card--full-height padding--lg">
                      <div className="card__header">
                        <span style={{fontSize: '2rem'}}>{emoji}</span>
                        <Heading as="h3">{title}</Heading>
                      </div>
                      <div className="card__body">
                        <p>{desc}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
