'use client';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Trophy, User } from 'lucide-react';

const items = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/practice/1', label: 'Practice', icon: BookOpen },
  { href: '/leaderboards', label: 'Leaders', icon: Trophy },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function AuthedLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <header className="p-4 shadow-sm sticky top-0 bg-paper z-10" role="banner">
        <Link href="/home" className="text-xl font-bold">Ìlọ̀</Link>
      </header>
      <main className="flex-1" role="main">{children}</main>
      <nav
        className="md:hidden flex justify-around border-t border-ink/10 py-2 bg-paper sticky bottom-0"
        role="navigation"
        aria-label="Primary"
      >
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center text-sm ${active ? 'text-accent' : 'text-ink'}`}
            >
              <Icon className="h-6 w-6" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
