'use client';

import { BottomNav } from '@/components/BottomNav';
import ThemeToggle from '@/components/ThemeToggle';
import { ThemeProvider } from '@/components/ThemeProvider';
import Footer from '@/components/footer/Footer';
import { TopAppBar } from '@/components/TopAppBar';
import { Chip } from '@/components/ui/Chip';
import { useToast } from '@/components/ui/Toast';
import { BookOpen, Home, Medal, Mic, UserCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

const NAV_ITEMS = [
  { label: 'Home', href: '/home', icon: <Home className="h-6 w-6" aria-hidden="true" /> },
  { label: 'Practice', href: '/practice/welcome', icon: <Mic className="h-6 w-6" aria-hidden="true" /> },
  { label: 'Lessons', href: '/lessons/intro', icon: <BookOpen className="h-6 w-6" aria-hidden="true" /> },
  { label: 'Leaderboard', href: '/leaderboards', icon: <Medal className="h-6 w-6" aria-hidden="true" /> },
  { label: 'Profile', href: '/profile', icon: <UserCircle className="h-6 w-6" aria-hidden="true" /> },
];

export default function AuthedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const mainRef = useRef<HTMLDivElement>(null);
  const { push } = useToast();

  useEffect(() => {
    mainRef.current?.focus();
  }, [pathname]);

  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col bg-paper c-on-paper">
        <TopAppBar
          streakDays={7}
          onNotificationsClick={() =>
            push({ title: 'Notifications', description: 'Nothing new yet — keep practicing!', tone: 'info' })
          }
          onProfileClick={() => push({ title: 'Profile', description: 'Open your profile to edit details below.', tone: 'info' })}
        >
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Chip tone="secondary" size="sm" className="hidden md:inline-flex">
              Today’s goal: 10 mins
            </Chip>
          </div>
        </TopAppBar>
        <main
          ref={mainRef}
          id="main-content"
          tabIndex={-1}
          className="mx-auto flex w-full max-w-screen-lg flex-1 flex-col gap-8 px-4 py-8 focus:outline-none"
          role="main"
        >
          {children}
        </main>
        <Footer />
        <BottomNav items={NAV_ITEMS} />
      </div>
    </ThemeProvider>
  );
}
