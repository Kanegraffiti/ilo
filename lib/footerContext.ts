import type { SupabaseClient } from '@supabase/supabase-js';

export type FooterRouteKind =
  | 'landing'
  | 'lesson'
  | 'practice'
  | 'leaderboard'
  | 'profile'
  | 'kids'
  | 'generic';

export type FooterModel = {
  greeting: string;
  routeKind: FooterRouteKind;
  primaryCta?: { href: string; label: string; icon?: string };
  secondaryLinks: { href: string; label: string }[];
  funFact?: { id: string; title: string; teaser: string; href: string };
  nextLesson?: { id: string; title: string; href: string } | null;
  showInstallHint: boolean;
  showNewsletter: boolean;
  offline?: boolean;
  childName?: string;
};

export interface FooterProfile {
  id: string;
  display_name?: string | null;
}

export interface FooterChild {
  id: string;
  nickname?: string | null;
  name?: string | null;
}

export interface FooterProgress {
  currentLessonId?: string | null;
  nextLessonId?: string | null;
  nextLessonTitle?: string | null;
  nextLessonHref?: string | null;
  lastScore?: number | null;
  streakDays?: number | null;
}

export interface FooterContextOptions {
  pathname: string;
  profile?: FooterProfile | null;
  child?: FooterChild | null;
  progress?: FooterProgress | null;
  installHint?: boolean;
  online?: boolean;
  supabase?: SupabaseClient | null;
  now?: Date;
}

const MORNING_GREET = 'Ẹ káàárọ̀!';
const AFTERNOON_GREET = 'Ẹ káàsán!';
const EVENING_GREET = 'Ẹ káalẹ́!';
const NIGHT_GREET = 'Ódá arò!';

export function getGreetingByHour(date: Date): string {
  const hour = date.getHours();
  if (hour >= 5 && hour < 11) {
    return MORNING_GREET;
  }
  if (hour >= 11 && hour < 16) {
    return AFTERNOON_GREET;
  }
  if (hour >= 16 && hour < 22) {
    return EVENING_GREET;
  }
  return NIGHT_GREET;
}

export function detectRouteKind(pathname: string): FooterRouteKind {
  const normalized = pathname.split('?')[0].split('#')[0] || '/';

  if (
    normalized === '/' ||
    normalized.startsWith('/landing') ||
    normalized.startsWith('/auth') ||
    normalized.startsWith('/install') ||
    normalized.startsWith('/facts')
  ) {
    return 'landing';
  }

  if (normalized.startsWith('/lessons')) {
    return 'lesson';
  }

  if (normalized.startsWith('/practice') || normalized.startsWith('/quiz')) {
    return 'practice';
  }

  if (normalized.startsWith('/leaderboard') || normalized.startsWith('/leaderboards')) {
    return 'leaderboard';
  }

  if (normalized.startsWith('/profile')) {
    return 'profile';
  }

  if (normalized.startsWith('/kids')) {
    return 'kids';
  }

  if (normalized.startsWith('/home')) {
    return 'generic';
  }

  return 'generic';
}

type FunFactRow = { id: string; title: string; body_md?: string | null; teaser?: string | null };

type LessonRow = { id: string; title: string; order_index?: number | null };

function buildTeaser(body?: string | null, fallback = ''): string {
  if (!body) {
    return fallback;
  }
  const trimmed = body.replace(/[#*_>`]/g, '').trim();
  if (trimmed.length <= 140) {
    return trimmed;
  }
  return `${trimmed.slice(0, 137)}…`;
}

async function fetchLatestFunFact(
  supabase: SupabaseClient | null | undefined,
): Promise<FooterModel['funFact'] | undefined> {
  if (!supabase) {
    return undefined;
  }

  try {
    const { data, error } = await supabase
      .from('fun_facts')
      .select('id,title,body_md')
      .order('published_at', { ascending: false })
      .limit(1);

    if (error || !data?.length) {
      return undefined;
    }

    const fact = data[0] as FunFactRow;
    return {
      id: fact.id,
      title: fact.title,
      teaser: buildTeaser(fact.body_md, 'Discover a Yorùbá surprise inside.'),
      href: `/facts#${fact.id}`,
    };
  } catch (error) {
    console.error('[footer] failed to load fun fact', error);
    return undefined;
  }
}

async function fetchLessons(
  supabase: SupabaseClient | null | undefined,
): Promise<LessonRow[] | undefined> {
  if (!supabase) {
    return undefined;
  }

  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('id,title,order_index')
      .order('order_index', { ascending: true })
      .limit(50);

    if (error) {
      return undefined;
    }

    return data as LessonRow[];
  } catch (error) {
    console.error('[footer] failed to load lessons', error);
    return undefined;
  }
}

function inferCurrentLessonSlug(pathname: string): string | undefined {
  const segments = pathname.split('?')[0].split('#')[0].split('/').filter(Boolean);
  const lessonIndex = segments.findIndex((segment) => segment === 'lessons');
  if (lessonIndex >= 0 && segments[lessonIndex + 1]) {
    return segments[lessonIndex + 1];
  }
  const practiceIndex = segments.findIndex((segment) => segment === 'practice');
  if (practiceIndex >= 0 && segments[practiceIndex + 1]) {
    return segments[practiceIndex + 1];
  }
  const quizIndex = segments.findIndex((segment) => segment === 'quiz');
  if (quizIndex >= 0 && segments[quizIndex + 1]) {
    return segments[quizIndex + 1];
  }
  return undefined;
}

function resolveNextLesson(
  lessons: LessonRow[] | undefined,
  currentId?: string | null,
): FooterModel['nextLesson'] | null {
  if (!lessons?.length) {
    return null;
  }

  if (!currentId) {
    const first = lessons[0];
    return first ? { id: first.id, title: first.title, href: `/lessons/${first.id}` } : null;
  }

  const sorted = [...lessons].sort((a, b) => {
    const aIndex = a.order_index ?? 0;
    const bIndex = b.order_index ?? 0;
    return aIndex - bIndex;
  });

  const currentIndex = sorted.findIndex((lesson) => lesson.id === currentId);
  if (currentIndex === -1) {
    const first = sorted[0];
    return first ? { id: first.id, title: first.title, href: `/lessons/${first.id}` } : null;
  }

  const next = sorted[currentIndex + 1];
  if (!next || next.id === currentId) {
    return null;
  }

  return { id: next.id, title: next.title, href: `/lessons/${next.id}` };
}

export async function getFooterModel({
  pathname,
  child,
  progress,
  installHint,
  online,
  supabase,
  now,
}: FooterContextOptions): Promise<FooterModel> {
  const greeting = getGreetingByHour(now ?? new Date());
  const routeKind = detectRouteKind(pathname);
  const childName = child?.nickname ?? child?.name ?? undefined;

  const showNewsletter = routeKind === 'landing' || routeKind === 'profile';
  const showInstallHint = Boolean(installHint);
  const offline = online === false;

  const secondaryLinks: FooterModel['secondaryLinks'] = [
    { href: '/lessons/intro', label: 'Lessons' },
    { href: '/practice/intro', label: 'Practice' },
    { href: '/leaderboards', label: 'Leaderboard' },
    { href: '/help', label: 'Help' },
  ];
  if (showInstallHint) {
    secondaryLinks.push({ href: '/install', label: 'Install app' });
  }

  let primaryCta: FooterModel['primaryCta'];
  switch (routeKind) {
    case 'landing':
      primaryCta = { href: '/auth/signup', label: 'Join Ìlọ̀', icon: '✨' };
      break;
    case 'lesson':
      primaryCta = {
        href: progress?.currentLessonId ? `/practice/${progress.currentLessonId}` : '/practice/intro',
        label: 'Keep practicing',
        icon: '🎧',
      };
      break;
    case 'practice':
      if (typeof progress?.lastScore === 'number' && progress.lastScore < 90) {
        primaryCta = {
          href: progress.currentLessonId ? `/quiz/${progress.currentLessonId}` : '/quiz/intro',
          label: 'Review mistakes',
          icon: '🔍',
        };
      } else if (progress?.currentLessonId) {
        primaryCta = {
          href: `/practice/${progress.currentLessonId}`,
          label: 'Record again',
          icon: '🎙️',
        };
      } else {
        primaryCta = { href: '/quiz/intro', label: 'Try a quiz', icon: '🎯' };
      }
      break;
    case 'leaderboard':
      primaryCta = {
        href: progress?.currentLessonId ? `/practice/${progress.currentLessonId}` : '/practice/intro',
        label: 'Practice now',
        icon: '💪',
      };
      break;
    case 'profile':
    case 'kids':
      if (childName) {
        primaryCta = { href: '/kids', label: 'Switch child', icon: '🧒' };
      } else {
        primaryCta = { href: '/kids', label: 'Add child profile', icon: '➕' };
      }
      break;
    case 'generic':
    default:
      primaryCta = { href: '/lessons/intro', label: 'Explore lessons', icon: '🧭' };
      break;
  }

  let lessons: LessonRow[] | undefined;
  let nextLesson: FooterModel['nextLesson'] | null = null;

  const shouldLoadLessons = routeKind === 'lesson' || routeKind === 'practice';
  if (shouldLoadLessons) {
    lessons = await fetchLessons(supabase);
    const currentSlug = progress?.currentLessonId ?? inferCurrentLessonSlug(pathname);
    nextLesson = resolveNextLesson(lessons, progress?.nextLessonId ?? currentSlug);

    if (progress?.nextLessonId && !nextLesson && lessons) {
      nextLesson = resolveNextLesson(lessons, progress.nextLessonId);
    }
  }

  if (!nextLesson) {
    nextLesson = null;
  }

  const funFact = await fetchLatestFunFact(supabase);

  return {
    greeting,
    routeKind,
    primaryCta,
    secondaryLinks,
    funFact,
    nextLesson,
    showInstallHint,
    showNewsletter,
    offline,
    childName,
  };
}
