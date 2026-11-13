import type { Lang } from '../data/product'

// Textes partagés entre les pages (header, footer, boutons store).
export const ui = {
  fr: {
    skip: 'Aller au contenu',
    nav: { how: 'Comment ça marche', ideas: 'Idées', privacy: 'Ta vie privée', pricing: 'Prix', download: 'Télécharger', support: 'Aide' },
    navLabel: 'Navigation principale',
    langSwitch: 'English',
    stores: {
      iosAlt: "Télécharger dans l'App Store",
      note: 'Gratuit · iPhone · Français et anglais',
    },
    footer: {
      app: "L'app",
      help: 'Aide',
      privacy: 'Confidentialité',
      terms: "Conditions d'utilisation",
      support: 'Assistance',
      contact: 'Contact',
      legal:
        "Souvnir est une application indépendante éditée par Djabel Solutions. Ta localisation sert uniquement à placer tes Souvnirs et à te prévenir quand tu passes à côté.",
    },
    cta: {
      title: 'Laisse ta voix là où elle compte.',
      body: 'Télécharge Souvnir gratuitement et dépose ton premier message en moins d’une minute.',
    },
  },
  en: {
    skip: 'Skip to content',
    nav: { how: 'How it works', ideas: 'Ideas', privacy: 'Your privacy', pricing: 'Pricing', download: 'Download', support: 'Help' },
    navLabel: 'Main navigation',
    langSwitch: 'Français',
    stores: {
      iosAlt: 'Download on the App Store',
      note: 'Free · iPhone · English and French',
    },
    footer: {
      app: 'The app',
      help: 'Help',
      privacy: 'Privacy',
      terms: 'Terms of use',
      support: 'Support',
      contact: 'Contact',
      legal:
        'Souvnir is an independent app published by Djabel Solutions. Your location is only used to place your Souvnirs and to let you know when you pass nearby.',
    },
    cta: {
      title: 'Leave your voice where it matters.',
      body: 'Download Souvnir for free and drop your first message in under a minute.',
    },
  },
} as const

export function t(lang: Lang) {
  return ui[lang]
}

/** Équivalences FR ⇄ EN des pages qui existent dans les deux langues. */
export const ROUTES = {
  home: { fr: '/', en: '/en/' },
  pricing: { fr: '/prix/', en: '/en/pricing/' },
  support: { fr: '/support/', en: '/en/support/' },
  privacy: { fr: '/privacy/', en: '/en/privacy/' },
  terms: { fr: '/terms/', en: '/en/terms/' },
} as const
