import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Software Architecture Docs',
  tagline: 'Microservicios · APIs · Patrones · ADRs',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://software-arch.naodeko.site',
  baseUrl: '/',
  trailingSlash: true,

  organizationName: 'NaoDekoNeko',
  projectName: 'thesis-doc-test-2',

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  customFields: {
    apiBaseUrl: 'https://api.naodeko.site',
    docFolder: 'thesis-doc-test-2',
  },

  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/NaoDekoNeko/thesis-doc-test-2/tree/master/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Software Architecture',
      logo: {
        alt: 'Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentación',
        },
        {
          href: 'https://platform-eng.naodeko.site/',
          label: '← Platform Engineering',
          position: 'left',
        },
        {
          href: 'https://github.com/NaoDekoNeko/thesis-doc-test-2',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Arquitectura',
          items: [
            { label: 'Microservicios', to: '/docs/microservices/intro' },
            { label: 'APIs REST', to: '/docs/apis/rest-design' },
            { label: 'Patrones', to: '/docs/patterns/solid' },
            { label: 'ADRs', to: '/docs/adrs/template' },
          ],
        },
        {
          title: 'Otros portales',
          items: [
            {
              label: 'Platform Engineering Docs',
              href: 'https://platform-eng.naodeko.site/',
            },
          ],
        },
        {
          title: 'Repositorio',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/NaoDekoNeko/thesis-doc-test-2',
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Thesis RAG PoC · NaoDekoNeko`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'typescript', 'yaml'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
