// Données structurées (JSON-LD) partagées. Les @id permettent aux pages de
// référencer l'organisation et l'app sans tout redéclarer.
import { LIMITS, PRICES, PUBLISHER, SITE, SOCIALS, STORES, type Lang } from './product'

export const ORG_ID = `${SITE}/#org`
export const APP_ID = `${SITE}/#app`
export const WEBSITE_ID = `${SITE}/#website`

export function organization() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: PUBLISHER.name,
    url: `${SITE}/`,
    logo: `${SITE}/assets/icon-512.png`,
    email: PUBLISHER.email,
    ...(SOCIALS.length ? { sameAs: SOCIALS.map((s) => s.url) } : {}),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: PUBLISHER.email,
      availableLanguage: ['fr', 'en'],
    },
  }
}

export function website() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: 'Souvnir',
    url: `${SITE}/`,
    inLanguage: ['fr', 'en'],
    publisher: { '@id': ORG_ID },
  }
}

export function app(lang: Lang) {
  const fr = lang === 'fr'
  const pricing = `${SITE}${fr ? '/prix/' : '/en/pricing/'}`
  return {
    '@type': 'MobileApplication',
    '@id': APP_ID,
    name: 'Souvnir',
    alternateName: fr ? 'Souvnir - Note vocale localisée' : 'Souvnir - Location-based voice notes',
    description: fr
      ? `App iPhone pour laisser des messages vocaux attachés à un lieu : on enregistre sa voix (et une photo), on la dépose sur la carte, et la personne choisie est prévenue quand elle repasse à cet endroit. Gratuit jusqu'à ${LIMITS.free.notes} Souvnirs actifs ; Souvnir+ en option.`
      : `iPhone app to leave voice messages tied to a place: record your voice (and a photo), drop it on the map, and the person you choose is notified when they pass by that spot again. Free for up to ${LIMITS.free.notes} active Souvnirs; optional Souvnir+.`,
    url: `${SITE}/`,
    image: `${SITE}/assets/icon-512.png`,
    operatingSystem: 'iOS',
    applicationCategory: 'LifestyleApplication',
    applicationSubCategory: fr ? 'Messages vocaux, souvenirs' : 'Voice messages, memories',
    inLanguage: ['fr', 'en'],
    isAccessibleForFree: true,
    offers: [
      { '@type': 'Offer', name: fr ? 'Gratuit' : 'Free', price: '0', priceCurrency: 'EUR' },
      { '@type': 'Offer', name: 'Souvnir+ ' + (fr ? 'mensuel' : 'monthly'), price: PRICES.monthly.toFixed(2), priceCurrency: 'EUR', url: pricing },
      { '@type': 'Offer', name: 'Souvnir+ ' + (fr ? 'annuel' : 'yearly'), price: PRICES.yearly.toFixed(2), priceCurrency: 'EUR', url: pricing },
    ],
    downloadUrl: STORES.ios,
    sameAs: [STORES.ios],
    publisher: { '@id': ORG_ID },
    author: { '@id': ORG_ID },
  }
}

export function faqPage(id: string, items: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    '@id': id,
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  }
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE}${it.path}`,
    })),
  }
}

export function webPage(path: string, name: string, lang: Lang) {
  return {
    '@type': 'WebPage',
    '@id': `${SITE}${path}#webpage`,
    url: `${SITE}${path}`,
    name,
    inLanguage: lang,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': APP_ID },
  }
}
