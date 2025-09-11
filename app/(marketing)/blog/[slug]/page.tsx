import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

export default function BlogPost({ params }: { params: { slug: string } }) {
  const filePath = path.join(process.cwd(), 'content/blog', `${params.slug}.md`);
  const source = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(source);
  const html = marked.parse(content);
  return (
    <article className="container mx-auto py-12">
      <h1 className="font-display text-4xl mb-6">{data.title}</h1>
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
