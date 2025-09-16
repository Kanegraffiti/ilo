'use client';

import { AuthCard } from '@/components/ui/AuthCard';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { Input } from '@/components/ui/Input';
import { usePageEnter } from '@/lib/anim';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import { emailSchema, passwordSchema } from '@/lib/zodSchemas';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type FormEvent, useMemo, useState } from 'react';

const passwordAuthEnabled = process.env.NEXT_PUBLIC_SUPABASE_PASSWORD_AUTH === 'true';

type SignInTab = 'magic' | 'password';

type Notice = { variant: 'success' | 'error'; message: string } | null;

function getEmailError(value: string): string | null {
  const parsed = emailSchema.safeParse(value);
  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? 'Please enter a valid email address.';
  }
  return null;
}

function getPasswordError(value: string): string | null {
  if (!passwordAuthEnabled) {
    return null;
  }
  const parsed = passwordSchema.safeParse(value);
  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? 'Please enter your password.';
  }
  return null;
}

export default function LoginPage() {
  const motionProps = usePageEnter();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<SignInTab>('magic');

  const [magicEmail, setMagicEmail] = useState('');
  const [magicTouched, setMagicTouched] = useState(false);
  const [magicError, setMagicError] = useState<string | null>(null);
  const [magicNotice, setMagicNotice] = useState<Notice>(null);
  const [magicLoading, setMagicLoading] = useState(false);

  const [passwordEmail, setPasswordEmail] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [passwordTouched, setPasswordTouched] = useState({ email: false, password: false });
  const [passwordErrors, setPasswordErrors] = useState<{ email: string | null; password: string | null }>({
    email: null,
    password: null,
  });
  const [passwordNotice, setPasswordNotice] = useState<Notice>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const tabs = useMemo(() => {
    if (!passwordAuthEnabled) {
      return [{ id: 'magic' as const, label: 'Magic link' }];
    }
    return [
      { id: 'magic' as const, label: 'Magic link' },
      { id: 'password' as const, label: 'Password' },
    ];
  }, []);

  const handleMagicSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMagicTouched(true);

    const parsed = emailSchema.safeParse(magicEmail);
    if (!parsed.success) {
      const nextError = parsed.error.issues[0]?.message ?? 'Please enter a valid email address.';
      setMagicError(nextError);
      return;
    }

    setMagicError(null);
    setMagicNotice(null);
    setMagicLoading(true);

    try {
      const response = await fetch('/api/auth/magic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: parsed.data }),
      });
      const data = (await response.json().catch(() => null)) as { ok?: boolean; message?: string } | null;

      if (response.ok && data?.ok) {
        setMagicNotice({ variant: 'success', message: 'Check your email for a safe magic link to sign in.' });
      } else {
        setMagicNotice({
          variant: 'error',
          message: data?.message ?? 'We could not send the link just now. Please try again soon.',
        });
      }
    } catch (error) {
      setMagicNotice({
        variant: 'error',
        message: 'We could not reach the server. Please check your connection and try again.',
      });
    } finally {
      setMagicLoading(false);
    }
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!passwordAuthEnabled) {
      return;
    }

    const emailIssue = getEmailError(passwordEmail);
    const passwordIssue = getPasswordError(passwordValue);
    setPasswordErrors({ email: emailIssue, password: passwordIssue });
    setPasswordTouched({ email: true, password: true });

    if (emailIssue || passwordIssue) {
      return;
    }

    setPasswordNotice(null);
    setPasswordLoading(true);

    try {
      const supabase = supabaseBrowser();
      const { error } = await supabase.auth.signInWithPassword({
        email: passwordEmail.trim().toLowerCase(),
        password: passwordValue,
      });

      if (error) {
        setPasswordNotice({
          variant: 'error',
          message: 'We could not sign you in with that password. Please try again or reset it.',
        });
        return;
      }

      setPasswordNotice({
        variant: 'success',
        message: 'You are signed in! Taking you to your family dashboard…',
      });
      router.push('/kids');
      router.refresh();
    } catch (error) {
      setPasswordNotice({
        variant: 'error',
        message: 'Something went wrong while signing in. Please try again in a moment.',
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <motion.div {...motionProps} className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-serif c-on-paper">Welcome back</h1>
        <p className="text-lg leading-relaxed c-on-paper">
          Choose the simplest way to sign in. We use secure magic links and passwords that kids can’t guess.
        </p>
      </header>
      <AuthCard
        title="Sign in to Ìlọ̀"
        description="Pick a sign-in option that works best for your family."
        icon={<LogIn className="h-7 w-7" aria-hidden="true" />}
        eyebrow="Safe for guardians"
      >
        <div className="space-y-6">
          {tabs.length > 1 ? (
            <div role="tablist" aria-label="Sign in options" className="flex flex-wrap gap-3">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)] ${
                      isActive
                        ? 'bg-primary c-on-primary shadow-sm'
                        : 'bg-surface/60 c-on-surface border border-[color:var(--color-on-surface)]/20'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          ) : null}

          {activeTab === 'magic' ? (
            <form className="space-y-4" onSubmit={handleMagicSubmit} noValidate>
              {magicNotice ? <Alert variant={magicNotice.variant}>{magicNotice.message}</Alert> : null}
              <Input
                label="Email address"
                type="email"
                value={magicEmail}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  setMagicEmail(nextValue);
                  if (magicTouched) {
                    setMagicError(getEmailError(nextValue));
                  }
                  if (magicNotice) {
                    setMagicNotice(null);
                  }
                }}
                onBlur={() => {
                  setMagicTouched(true);
                  setMagicError(getEmailError(magicEmail));
                }}
                helperText="We’ll send you a magic link so you don’t need to remember a password."
                errorText={magicError ?? undefined}
                autoComplete="email"
                required
              />
              <Button type="submit" disabled={magicLoading} className="w-full">
                {magicLoading ? 'Sending link…' : 'Send magic link'}
              </Button>
            </form>
          ) : null}

          {passwordAuthEnabled && activeTab === 'password' ? (
            <form className="space-y-4" onSubmit={handlePasswordSubmit} noValidate>
              {passwordNotice ? <Alert variant={passwordNotice.variant}>{passwordNotice.message}</Alert> : null}
              <Input
                label="Email address"
                type="email"
                value={passwordEmail}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  setPasswordEmail(nextValue);
                  if (passwordTouched.email) {
                    setPasswordErrors((prev) => ({ ...prev, email: getEmailError(nextValue) }));
                  }
                  if (passwordNotice) {
                    setPasswordNotice(null);
                  }
                }}
                onBlur={() => {
                  setPasswordTouched((prev) => ({ ...prev, email: true }));
                  setPasswordErrors((prev) => ({ ...prev, email: getEmailError(passwordEmail) }));
                }}
                helperText="Enter the email you used when creating your guardian account."
                errorText={passwordErrors.email ?? undefined}
                autoComplete="email"
                required
              />
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={passwordValue}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  setPasswordValue(nextValue);
                  if (passwordTouched.password) {
                    setPasswordErrors((prev) => ({ ...prev, password: getPasswordError(nextValue) }));
                  }
                  if (passwordNotice) {
                    setPasswordNotice(null);
                  }
                }}
                onBlur={() => {
                  setPasswordTouched((prev) => ({ ...prev, password: true }));
                  setPasswordErrors((prev) => ({ ...prev, password: getPasswordError(passwordValue) }));
                }}
                helperText="Keep your password private so only grown-ups can sign in."
                errorText={passwordErrors.password ?? undefined}
                autoComplete="current-password"
                required
                trailingAccessory={
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="rounded-full bg-[color:var(--color-on-surface)]/10 px-3 py-2 text-sm font-semibold c-on-surface transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
                    aria-pressed={showPassword}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                }
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link href="/help" className="text-sm font-semibold underline-offset-4 c-on-surface hover:underline">
                  Forgot password?
                </Link>
                <Button type="submit" disabled={passwordLoading} className="w-full sm:w-auto">
                  {passwordLoading ? 'Signing in…' : 'Sign in'}
                </Button>
              </div>
            </form>
          ) : null}

          <Divider>New to Ìlọ̀?</Divider>
          <div className="flex flex-col gap-3 rounded-2xl bg-[color:var(--color-on-surface)]/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-base leading-relaxed c-on-surface">
              Guardians can create an account to add child profiles and track progress.
            </p>
            <Button href="/auth/signup" variant="secondary" className="w-full sm:w-auto">
              Create an account
            </Button>
          </div>
        </div>
      </AuthCard>
    </motion.div>
  );
}
