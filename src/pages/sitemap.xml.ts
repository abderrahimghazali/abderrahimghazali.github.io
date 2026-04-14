import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const site = 'https://abderrahimghazali.github.io';
  const posts = await getCollection('blog');
  const today = new Date().toISOString().split('T')[0];

  const staticPages = [
    { url: '/', priority: '1.0', lastmod: today },
    { url: '/about/', priority: '0.8', lastmod: today },
    { url: '/blog/', priority: '0.9', lastmod: today },
  ];

  const blogPages = posts.map((post) => ({
    url: `/blog/${post.id}/`,
    priority: '0.7',
    lastmod: post.data.date.toISOString().split('T')[0],
  }));

  const pages = [...staticPages, ...blogPages];

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
