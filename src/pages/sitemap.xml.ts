import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const site = 'https://abderrahimghazali.github.io';
  const today = new Date().toISOString().split('T')[0];

  const pages = [
    { url: '/', priority: '1.0', lastmod: today },
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
