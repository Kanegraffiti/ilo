'use client';

import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, useCallback } from 'react';

import {
  FunFactCard,
  GreetingBar,
  LegalRow,
  NewsletterMini,
  NextLessonCard,
  PrimaryCta,
  QuickNav,
  StatusPills,
} from '@/components/footer/FooterSections';
import MascotWave from '@/components/footer/MascotWave';
import { getFooterModel, type FooterChild, type FooterModel, type FooterProgress } from '@/lib/footerContext';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import { usePrefersReducedMotion } from '@/lib/anim';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt: () => Promise<void>;
}

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();
  const [model, setModel] = useState<FooterModel | null>(null);
  const [child, setChild] = useState<FooterChild | null>(null);
  const [progress, setProgress] = useState<FooterProgress | null>(null);
  const [online, setOnline] = useState<boolean>(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine,
  );
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installDismissed, setInstallDismissed] = useState(false);
  const [now, setNow] = useState(() => new Date());

  const supabase = useMemo(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      return supabaseBrowser();
    } catch (error) {
      console.error('[footer] failed to create supabase client', error);
      return null;
    }
  }, []);

  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const updateOnlineStatus = () => setOnline(window.navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const checkStandalone = () => {
      const matchStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const navigatorStandalone = (window.navigator as typeof window.navigator & { standalone?: boolean }).standalone;
      setIsStandalone(Boolean(matchStandalone || navigatorStandalone));
    };

    checkStandalone();

    const handlePrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
      setInstallDismissed(false);
    };

    const handleInstalled = () => {
      setInstallPrompt(null);
      checkStandalone();
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    window.addEventListener('appinstalled', handleInstalled);
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleModeChange = () => checkStandalone();
    mediaQuery.addEventListener('change', handleModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt);
      window.removeEventListener('appinstalled', handleInstalled);
      mediaQuery.removeEventListener('change', handleModeChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const interval = window.setInterval(() => setNow(new Date()), 5 * 60 * 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!supabase) {
      setChild(null);
      setProgress(null);
      return;
    }

    let active = true;

    const loadContext = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData.session;
        if (!session) {
          if (active) {
            setChild(null);
            setProgress(null);
          }
          return;
        }

        const [profileResponse, childResponse] = await Promise.all([
          supabase
            .from('user_profiles')
            .select('id,display_name')
            .eq('user_id', session.user.id)
            .maybeSingle(),
          supabase
            .from('child_profiles')
            .select('id,nickname')
            .order('created_at', { ascending: true })
            .limit(1),
        ]);

        const guardianProfile = profileResponse.error ? null : profileResponse.data;
        const childRows = childResponse.error ? null : childResponse.data;
        const activeChild = childRows && childRows.length > 0 ? childRows[0] : null;

        let resolvedChild: FooterChild | null = null;
        let resolvedProgress: FooterProgress | null = null;

        if (activeChild) {
          resolvedChild = { id: activeChild.id, nickname: activeChild.nickname };
          const [{ data: progressRows }, { data: quizRows }] = await Promise.all([
            supabase
              .from('progress')
              .select('lesson_id,streak_days')
              .eq('owner_kind', 'child')
              .eq('owner_id', activeChild.id)
              .order('last_activity_at', { ascending: false })
              .limit(1),
            supabase
              .from('quiz_results')
              .select('score')
              .eq('owner_kind', 'child')
              .eq('owner_id', activeChild.id)
              .order('created_at', { ascending: false })
              .limit(1),
          ]);

          const latestProgress = progressRows && progressRows.length > 0 ? progressRows[0] : null;
          const latestQuiz = quizRows && quizRows.length > 0 ? quizRows[0] : null;

          resolvedProgress = {
            currentLessonId: latestProgress?.lesson_id ?? undefined,
            lastScore: typeof latestQuiz?.score === 'number' ? latestQuiz.score : null,
            streakDays: latestProgress?.streak_days ?? null,
          };
        } else if (guardianProfile) {
          const guardianId = guardianProfile.id;
          const [{ data: progressRows }, { data: quizRows }] = await Promise.all([
            supabase
              .from('progress')
              .select('lesson_id,streak_days')
              .eq('owner_kind', 'user')
              .eq('owner_id', guardianId)
              .order('last_activity_at', { ascending: false })
              .limit(1),
            supabase
              .from('quiz_results')
              .select('score')
              .eq('owner_kind', 'user')
              .eq('owner_id', guardianId)
              .order('created_at', { ascending: false })
              .limit(1),
          ]);

          const latestProgress = progressRows && progressRows.length > 0 ? progressRows[0] : null;
          const latestQuiz = quizRows && quizRows.length > 0 ? quizRows[0] : null;
          resolvedProgress = {
            currentLessonId: latestProgress?.lesson_id ?? undefined,
            lastScore: typeof latestQuiz?.score === 'number' ? latestQuiz.score : null,
            streakDays: latestProgress?.streak_days ?? null,
          };
        }

        if (active) {
          setChild(resolvedChild);
          setProgress(resolvedProgress);
        }
      } catch (error) {
        console.error('[footer] failed to load context', error);
        if (active) {
          setChild(null);
          setProgress(null);
        }
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadContext();
    });

    loadContext();

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const showInstallHint = !isStandalone && !installDismissed;

  useEffect(() => {
    let active = true;

    getFooterModel({
      pathname,
      child,
      progress,
      installHint: showInstallHint,
      online,
      supabase,
      now,
    })
      .then((value) => {
        if (active) {
          setModel(value);
        }
      })
      .catch((error) => {
        console.error('[footer] failed to build model', error);
      });

    return () => {
      active = false;
    };
  }, [pathname, child, progress, showInstallHint, online, supabase, now]);

  const handleInstallClick = useCallback(async () => {
    if (installPrompt) {
      try {
        await installPrompt.prompt();
        const choice = await installPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setInstallDismissed(true);
          setInstallPrompt(null);
        } else {
          setInstallDismissed(true);
        }
      } catch (error) {
        console.error('[footer] install prompt failed', error);
      }
    } else {
      router.push('/install');
      setInstallDismissed(true);
    }
  }, [installPrompt, router]);

  if (!model) {
    return null;
  }

  const footerMotion = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: 'easeOut' },
      } as const;

  return (
    <motion.footer
      role="contentinfo"
      aria-label="Site footer"
      className="bg-surface-1 c-on-surface-1 b-border r-xl shadow-sm mt-8 px-4 pt-6 pb-24 md:px-6 md:py-8"
      {...footerMotion}
    >
      <div className="mx-auto flex w-full max-w-screen-lg flex-col gap-6">
        <GreetingBar greeting={model.greeting} Mascot={MascotWave} childName={model.childName} />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-4">
            <PrimaryCta cta={model.primaryCta} />
            <StatusPills
              offline={model.offline}
              showInstall={model.showInstallHint}
              onInstallClick={showInstallHint ? handleInstallClick : undefined}
            />
          </div>
          <div>
            {model.nextLesson ? (
              <NextLessonCard data={model.nextLesson} progress={progress} />
            ) : (
              <FunFactCard data={model.funFact} />
            )}
          </div>
          <div className="space-y-4">
            <QuickNav links={model.secondaryLinks} />
            {model.showNewsletter ? <NewsletterMini /> : null}
            <LegalRow />
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
