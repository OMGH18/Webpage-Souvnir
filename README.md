# Site Souvnir

Site vitrine de l'app Souvnir : https://souvnir.djabelsolutions.fr
Même base technique que le site Shobukan (Astro, statique, GitHub Pages).

## Modifier le site

- Faits publics (prix, limites de l’offre gratuite) : `src/data/product.ts`.
  Ils viennent du dépôt `souvenir-app` (`contexts/PremiumContext.tsx` pour les limites).
- Textes de l'accueil : `src/components/HomePage.astro` (FR et EN dans le même fichier).
- Prix : `src/components/PricingPanel.astro` et `PricingPage.astro`.
- Aide et textes légaux : `src/content/legal.json`, repris tels quels de l’ancien site.
- Couleurs et polices : `src/styles/global.css`.

## Développer

```bash
npm ci
npm run dev
```

## Publier

Chaque push sur `main` construit et publie le site (GitHub Actions), puis
prévient Bing via IndexNow. Prérequis, une seule fois : Settings → Pages →
Build and deployment → Source = « GitHub Actions ».
