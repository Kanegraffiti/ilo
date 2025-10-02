'use client';

import { BottomNav } from '@/components/BottomNav';
import ThemeToggle from '@/components/ThemeToggle';
import { ThemeProvider } from '@/components/ThemeProvider';
import Footer from '@/components/footer/Footer';
import { TopAppBar } from '@/components/TopAppBar';
import { Chip } from '@/components/ui/Chip';
import { useToast } from '@/components/ui/Toast';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import { BookOpen, GraduationCap, Home, Medal, Mic, UserCircle, Users } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function AuthedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const mainRef = useRef<HTMLDivElement>(null);
  const { push } = useToast();
  const [role, setRole] = useState<'teacher' | 'guardian'>('guardian');

  useEffect(() => {
    mainRef.current?.focus();
  }, [pathname]);

  useEffect(() => {
    let isActive = true;
    async function loadRole() {
      try {
        const supabase = supabaseBrowser();
        const { data } = await supabase.auth.getUser();
        const user = data.user;
        if (!user) {
          if (isActive) setRole('guardian');
          return;
        }
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();
        if (isActive && profile?.role === 'teacher') {
          setRole('teacher');
        } else if (isActive) {
          setRole('guardian');
        }
      } catch (error) {
        console.error('Failed to determine user role', error);
        if (isActive) setRole('guardian');
      }
    }
    loadRole();
    return () => {
      isActive = false;
    };
  }, []);

  const navItems = useMemo(
    () => [
      { label: 'Home', href: '/home', icon: <Home className="h-6 w-6" aria-hidden="true" /> },
      { label: 'Practice', href: '/practice/welcome', icon: <Mic className="h-6 w-6" aria-hidden="true" /> },
      { label: 'Lessons', href: '/lessons/intro', icon: <BookOpen className="h-6 w-6" aria-hidden="true" /> },
      { label: 'Cohorts', href: '/cohorts', icon: <Users className="h-6 w-6" aria-hidden="true" /> },
      ...(role === 'teacher'
        ? [{ label: 'Teach', href: '/teacher/dashboard', icon: <GraduationCap className="h-6 w-6" aria-hidden="true" /> }]
        : []),
      { label: 'Leaderboard', href: '/leaderboards', icon: <Medal className="h-6 w-6" aria-hidden="true" /> },
      { label: 'Profile', href: '/profile', icon: <UserCircle className="h-6 w-6" aria-hidden="true" /> },
    ],
    [role],
  );

  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col bg-paper text-ink">
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
        <BottomNav items={navItems} />
      </div>
    </ThemeProvider>
  );
}
