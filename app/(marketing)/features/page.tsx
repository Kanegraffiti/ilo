import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

export const metadata = { title: 'Features - Ìlọ̀' };

export default function FeaturesPage() {
  const md = fs.readFileSync(path.join(process.cwd(), 'content/features.md'), 'utf8');
  const html = marked.parse(md);
  return (
    <section className="container mx-auto py-12">
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  );
}
