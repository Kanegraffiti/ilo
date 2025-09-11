import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { AccordionItem } from '@/components/ui/accordion';

export const metadata = { title: 'FAQ - Ìlọ̀' };

export default function FAQPage() {
  const file = fs.readFileSync(path.join(process.cwd(), 'content/faq.yaml'), 'utf8');
  const faqs = yaml.parse(file);
  return (
    <section className="container mx-auto py-12">
      <h1 className="font-display text-4xl mb-6">FAQ</h1>
      <div>
        {faqs.map((f: any, i: number) => (
          <AccordionItem key={i} question={f.question} answer={f.answer} />
        ))}
      </div>
    </section>
  );
}
