import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-cream border-t mt-12">
      <div className="container mx-auto p-6 grid gap-4 md:grid-cols-3 text-sm">
        <div>
          <Image src="/logo/ilo-wordmark.svg" alt="Ìlọ̀" width={80} height={24} />
          <p className="mt-2">© {new Date().getFullYear()} Ìlọ̀.</p>
        </div>
        <div className="flex flex-col space-y-2">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/status">Status</Link>
        </div>
        <div className="flex flex-col space-y-2">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
      </div>
    </footer>
  );
}
