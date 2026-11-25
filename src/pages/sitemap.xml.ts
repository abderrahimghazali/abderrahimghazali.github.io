import type { APIRoute } from 'astro';
import { lastVerified } from '../data/reforme';

export const GET: APIRoute = async () => {
  const site = 'https://abderrahimghazali.github.io';
  const toolsUpdated = '2026-11-25';
  const today = new Date().toISOString().split('T')[0];

  const pages = [
    { url: '/', priority: '1.0', lastmod: today },
    { url: '/facturation-electronique-maroc/', priority: '0.8', lastmod: lastVerified },
    { url: '/outils/', priority: '0.6', lastmod: toolsUpdated },
    { url: '/outils/verificateur-ice/', priority: '0.7', lastmod: toolsUpdated },
    { url: '/outils/generateur-ubl/', priority: '0.7', lastmod: toolsUpdated },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((page) => `  <url>
    <loc>${site}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
