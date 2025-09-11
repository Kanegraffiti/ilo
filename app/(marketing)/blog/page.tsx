import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

export const metadata = { title: 'Blog - Ìlọ̀' };

export default function BlogIndex() {
  const postsDir = path.join(process.cwd(), 'content/blog');
  const posts = fs.readdirSync(postsDir).map((file) => {
    const source = fs.readFileSync(path.join(postsDir, file), 'utf8');
    const { data } = matter(source);
    return { slug: file.replace(/\.md$/, ''), title: data.title };
  });
  return (
    <section className="container mx-auto py-12">
      <h1 className="font-display text-4xl mb-6">Blog</h1>
      <ul className="space-y-4">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`} className="text-brand hover:underline">
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
