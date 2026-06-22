export const translations = {
  pt: {
    hero: {
      badge_prefix: "// construo",
      sub: "Fullstack dev. Interface, servidor, banco de dados e infra — do zero.",
      cta_projects: "Ver projetos",
      phrases: [
        "sites e sistemas",
        "chatbots com IA",
        "APIs e backends",
        "automações reais",
        "experiências web",
        "do zero mesmo",
      ],
    },
    about: {
      heading_1: "Fullstack",
      heading_2: "developer.",
      bio_1:
        "Sou desenvolvedor fullstack de Ribeirão Preto. Construo aplicações completas, do design de interface até a infraestrutura — com foco em performance, clareza e código que dura.",
      bio_2:
        "Trabalho com clientes que precisam de mais do que um site bonito: sistemas reais, integrações, automações e experiências que convertem.",
      stat_1_label: "projetos entregues",
      stat_1_value: "30+",
      stat_2_label: "anos no mercado",
      stat_2_value: "4+",
      stat_3_label: "clientes ativos",
      stat_3_value: "8",
      stat_4_label: "uptime médio",
      stat_4_value: "99.9%",
      availability: "disponível para projetos",
      section_title: "Sobre mim",
      label: "// quem está por trás do código",
    },
  },
  en: {
    hero: {
      badge_prefix: "// I build",
      sub: "Fullstack dev. Interface, server, database and infra — from scratch.",
      cta_projects: "See projects",
      phrases: [
        "websites & systems",
        "AI chatbots",
        "APIs & backends",
        "real automations",
        "web experiences",
        "from scratch",
      ],
    },
    about: {
      heading_1: "Fullstack",
      heading_2: "Developer",
      bio_1:
        "I'm a fullstack developer from Ribeirão Preto, Brazil. I build complete applications — from interface design to infrastructure — focused on performance, clarity and code that lasts.",
      bio_2:
        "I work with clients who need more than a pretty website: real systems, integrations, automations and experiences that convert.",
      stat_1_label: "projects delivered",
      stat_1_value: "30+",
      stat_2_label: "years in the market",
      stat_2_value: "4+",
      stat_3_label: "active clients",
      stat_3_value: "8",
      stat_4_label: "average uptime",
      stat_4_value: "99.9%",
      availability: "available for projects",
      section_title: "About me",
      label: "// who's behind the code",
    },
  },
} as const;

export type Locale = keyof typeof translations;
export type Translations = typeof translations;
