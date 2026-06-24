import { getPublishedPosts } from '@/lib/queries/blog';
import { SITE } from '@/lib/site';

export const revalidate = 3600;

const XML_ESCAPES: Record<string, string> = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  "'": '&apos;',
  '"': '&quot;',
};

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (char) => XML_ESCAPES[char] ?? char);
}

export async function GET() {
  const posts = await getPublishedPosts();

  const items = posts
    .map((post) => {
      const link = `${SITE.url}/blog/${post.slug}`;
      const pubDate = post.publishedAt ? `<pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>` : '';
      return [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${link}</link>`,
        `      <guid>${link}</guid>`,
        `      ${pubDate}`,
        `      <description>${escapeXml(post.excerpt)}</description>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '  <channel>',
    '    <title>Travis Payne — From the Studio</title>',
    `    <link>${SITE.url}/blog</link>`,
    '    <description>News, insights, and stories from the studio.</description>',
    items,
    '  </channel>',
    '</rss>',
  ].join('\n');

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
