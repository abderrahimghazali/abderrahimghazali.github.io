export const SITE = 'https://abderrahimghazali.github.io';
const author = { '@type': 'Person', name: 'Abderrahim Ghazali', url: `${SITE}/` };

export function webApplication(o: { name: string; description: string; url: string; image: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: o.name,
    description: o.description,
    url: o.url,
    image: `${SITE}${o.image}`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    inLanguage: 'fr',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    author,
  };
}

export function faqPage(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: 'fr',
    mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

export function breadcrumbs(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
  };
}
