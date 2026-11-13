// Source de vérité du site Souvnir : chaque fait public (pages, JSON-LD,
// llms.txt) vient d'ici. Sources : dépôt souvenir-app
// (contexts/PremiumContext.tsx pour les limites, i18n/locales pour les textes).

export const SITE = 'https://souvnir.djabelsolutions.fr'

export const APP_STORE_ID = '6763946742'

export const STORES = {
  iosFr: `https://apps.apple.com/fr/app/souvnir-note-vocale-localis%C3%A9e/id${APP_STORE_ID}`,
  ios: `https://apps.apple.com/app/id${APP_STORE_ID}`,
} as const

export function iosLink(lang: Lang): string {
  return lang === 'fr' ? STORES.iosFr : STORES.ios
}

/** Comptes officiels. Vide tant qu'aucun compte n'est confirmé. */
export const SOCIALS: { label: string; url: string }[] = []

export const PUBLISHER = {
  name: 'Djabel Solutions',
  email: 'support@djabelsolutions.fr',
  country: 'FR',
} as const

/**
 * Prix de référence en France, repris de l'ancien site (les prix de l'app
 * viennent de l'App Store au moment de l'achat). À confirmer à chaque changement.
 */
export const PRICES = {
  monthly: 5.99,
  yearly: 49.99,
  yearlyPerMonth: 4.17,
} as const

/** Limites des offres (contexts/PremiumContext.tsx). */
export const LIMITS = {
  free: { notes: 10, friends: 3, seconds: 30 },
  premium: { seconds: 90 },
} as const

export type Lang = 'fr' | 'en'

export function formatPrice(value: number, lang: Lang): string {
  return new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-IE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value)
}

export function formatNumber(value: number, lang: Lang): string {
  return new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US').format(value)
}
