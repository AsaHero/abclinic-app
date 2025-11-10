// scripts/generate-sitemap.ts
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve } from 'path';
import { allServices, serviceCategories } from '../src/types/serviceData';

const SITE = process.env.SITE_URL || 'https://abclinic.uz';
const outDir = resolve(process.cwd(), 'public'); // vite копирует public на корень билда

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const now = new Date().toISOString();

function url(loc: string, priority = '0.7', changefreq = 'weekly', lastmod = now) {
  return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const urls: string[] = [];

// базовые страницы
urls.push(url(`${SITE}/`, '1.0', 'weekly'));
urls.push(url(`${SITE}/services`, '0.9', 'weekly'));
urls.push(url(`${SITE}/contact`, '0.6', 'monthly'));

// категории (канонические как у тебя — через ?category=...)
serviceCategories
  .filter((c) => c.id !== 'all')
  .forEach((c) => {
    urls.push(url(`${SITE}/services?category=${encodeURIComponent(c.id)}`, '0.8', 'weekly'));
  });

// страницы услуг
allServices.forEach((svc) => {
  urls.push(url(`${SITE}/services/${svc.id}`, '0.8', 'monthly'));
});

// если есть комплексные пакеты (пример)
const complexPackages = [
  // перечисли реальные packageId или импортируй их, если они есть в коде
  'smile-makeover',
];
urls.push(url(`${SITE}/complex-treatment`, '0.6', 'monthly'));
complexPackages.forEach((id) => {
  urls.push(url(`${SITE}/complex-treatment/${id}`, '0.6', 'monthly'));
});

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${urls.join('\n')}
</urlset>
`;

writeFileSync(resolve(outDir, 'sitemap.xml'), xml.trim() + '\n', 'utf8');

// robots.txt
const robots = `User-agent: *
Allow: /

# не индексируем поиск и любые динамические фильтры (пример)
Disallow: /?q=
Disallow: /*?*q=

Sitemap: ${SITE}/sitemap.xml
`;

writeFileSync(resolve(outDir, 'robots.txt'), robots, 'utf8');

console.log('✓ sitemap.xml и robots.txt сгенерированы в /public');
