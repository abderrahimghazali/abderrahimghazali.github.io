import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const site = 'https://abderrahimghazali.github.io';
  const posts = await getCollection('blog');

  const staticPages = [
    { url: '/', priority: '1.0' },
    { url: '/about/', priority: '0.8' },
    { url: '/blog/', priority: '0.9' },
  ];

  const blogPages = posts.map((post) => ({
    url: `/blog/${post.id}/`,
    priority: '0.7',
  }));

  const pages = [...staticPages, ...blogPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((page) => `  <url>
    <loc>${site}${page.url}</loc>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
