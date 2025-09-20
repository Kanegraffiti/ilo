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
import { CheckCircle2, Clock3, Eye, EyeOff, Lock, LogIn, Mail, ShieldCheck, Users } from 'lucide-react';
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

  const highlightItems = useMemo(
    () => [
      {
        title: 'Kid-safe links',
        description: 'Magic links expire quickly so curious kids stay protected.',
        icon: <ShieldCheck className="h-6 w-6" aria-hidden="true" />,
      },
      {
        title: 'Fast access',
        description: 'Email arrives within a minute and works on any trusted device.',
        icon: <Clock3 className="h-6 w-6" aria-hidden="true" />,
      },
      {
        title: 'Guardian controls',
        description: 'Manage passwords and child profiles from your family dashboard.',
        icon: <Users className="h-6 w-6" aria-hidden="true" />,
      },
    ],
    [],
  );

  const showMagicSuccess = magicTouched && !magicError && magicEmail.length > 0;
  const showPasswordEmailSuccess =
    passwordTouched.email && !passwordErrors.email && passwordEmail.length > 0;
  const showPasswordValueSuccess =
    passwordTouched.password && !passwordErrors.password && passwordValue.length > 0;

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
    <motion.div
      {...motionProps}
      className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-10 sm:px-6 lg:px-8"
    >
      <header className="space-y-4 text-center sm:text-left">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-[color:var(--color-primary)]/10 px-4 py-2 text-sm font-semibold text-[color:var(--color-primary)] sm:mx-0">
          <LogIn className="h-4 w-4" aria-hidden="true" />
          <span>Guardian protected sign-in</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-serif c-on-paper sm:text-5xl">Welcome back</h1>
          <p className="text-lg leading-relaxed c-on-paper opacity-80 sm:max-w-2xl">
            Choose the sign-in flow that fits your day. We keep your learner profiles safe behind
            magic links and strong passwords.
          </p>
        </div>
      </header>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <AuthCard
          title="Sign in to Ìlọ̀"
          description="Securely access your family dashboard and keep every child’s progress in one joyful place."
          icon={<LogIn className="h-7 w-7" aria-hidden="true" />}
          eyebrow="Family access"
          headerTone="primary"
        >
          <div className="space-y-6">
            <p className="rounded-2xl border border-[color:var(--color-primary)]/15 bg-[color:var(--color-primary)]/5 p-4 text-base leading-relaxed text-[color:var(--color-on-surface)]">
              Use the email you registered with Ìlọ̀. Magic links stay active for 15 minutes so only
              trusted grown-ups can join your learners.
            </p>
            {tabs.length > 1 ? (
              <div
                role="tablist"
                aria-label="Sign in options"
                className="flex flex-wrap gap-3 rounded-2xl bg-[color:var(--color-on-surface)]/5 p-2"
              >
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
                          : 'border border-[color:var(--color-on-surface)]/15 bg-[color:var(--color-on-surface)]/5 text-[color:var(--color-on-surface)] hover:bg-[color:var(--color-on-surface)]/10'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            ) : null}

            {activeTab === 'magic' ? (
              <form className="space-y-5" onSubmit={handleMagicSubmit} noValidate>
                {magicNotice ? <Alert variant={magicNotice.variant}>{magicNotice.message}</Alert> : null}
                <Input
                  label="Email address"
                  type="email"
                  value={magicEmail}
                  leadingIcon={<Mail className="h-5 w-5 text-[color:var(--color-primary)]" aria-hidden="true" />}
                  trailingIcon={
                    showMagicSuccess ? (
                      <CheckCircle2 className="h-5 w-5 text-[color:var(--color-primary)]" aria-hidden="true" />
                    ) : undefined
                  }
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
                  helperText="We’ll send a one-time link that expires in 15 minutes."
                  errorText={magicError ?? undefined}
                  autoComplete="email"
                  required
                />
                <Button type="submit" disabled={magicLoading} className="w-full">
                  {magicLoading ? 'Sending link…' : 'Send safe magic link'}
                </Button>
                <p className="text-sm text-[color:var(--color-on-surface)]/70">
                  Look for an email from <span className="font-semibold text-primary">hello@ilo.school</span>.
                  Open it on the device you want to use.
                </p>
              </form>
            ) : null}

            {passwordAuthEnabled && activeTab === 'password' ? (
              <form className="space-y-5" onSubmit={handlePasswordSubmit} noValidate>
                {passwordNotice ? <Alert variant={passwordNotice.variant}>{passwordNotice.message}</Alert> : null}
                <Input
                  label="Email address"
                  type="email"
                  value={passwordEmail}
                  leadingIcon={<Mail className="h-5 w-5 text-[color:var(--color-primary)]" aria-hidden="true" />}
                  trailingIcon={
                    showPasswordEmailSuccess ? (
                      <CheckCircle2 className="h-5 w-5 text-[color:var(--color-primary)]" aria-hidden="true" />
                    ) : undefined
                  }
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
                  helperText="Use the email you used when creating your guardian account."
                  errorText={passwordErrors.email ?? undefined}
                  autoComplete="email"
                  required
                />
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordValue}
                  leadingIcon={<Lock className="h-5 w-5 text-[color:var(--color-primary)]" aria-hidden="true" />}
                  trailingIcon={
                    showPasswordValueSuccess ? (
                      <CheckCircle2 className="h-5 w-5 text-[color:var(--color-primary)]" aria-hidden="true" />
                    ) : undefined
                  }
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
                  helperText="Include upper and lowercase letters plus a number."
                  errorText={passwordErrors.password ?? undefined}
                  autoComplete="current-password"
                  required
                  trailingAccessory={
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-primary)]/10 px-3 py-2 text-sm font-semibold text-[color:var(--color-on-surface)] transition hover:bg-[color:var(--color-primary)]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
                      aria-pressed={showPassword}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      )}
                      <span className="text-sm font-semibold">{showPassword ? 'Hide' : 'Show'}</span>
                    </button>
                  }
                />
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Link
                    href="/help"
                    className="text-sm font-semibold underline-offset-4 text-[color:var(--color-on-surface)] hover:underline"
                  >
                    Forgot password?
                  </Link>
                  <Button type="submit" disabled={passwordLoading} className="w-full sm:w-auto">
                    {passwordLoading ? 'Signing in…' : 'Sign in securely'}
                  </Button>
                </div>
              </form>
            ) : null}

            <Divider>Need an account?</Divider>
            <div className="flex flex-col gap-4 rounded-2xl border border-[color:var(--color-primary)]/15 bg-[color:var(--color-primary)]/5 p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-base leading-relaxed text-[color:var(--color-on-surface)]">
                Guardians can create an account to add child profiles and track joyful progress.
              </p>
              <Button href="/auth/signup" variant="secondary" className="w-full sm:w-auto">
                Create an account
              </Button>
            </div>
          </div>
        </AuthCard>
        <section className="space-y-6 rounded-3xl bg-[color:var(--color-surface)]/70 p-6 ring-1 ring-[color:var(--color-on-surface)]/10 backdrop-blur-sm">
          <h2 className="text-2xl font-serif leading-tight text-[color:var(--color-on-surface)]">
            Why families trust Ìlọ̀
          </h2>
          <p className="text-base leading-relaxed text-[color:var(--color-on-surface)]/80">
            Every guardian account comes with tools to keep little learners safe while celebrating their wins.
          </p>
          <ul className="space-y-4">
            {highlightItems.map((item) => (
              <li
                key={item.title}
                className="flex gap-3 rounded-2xl border border-[color:var(--color-on-surface)]/10 bg-[color:var(--color-on-surface)]/5 p-4"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)]">
                  {item.icon}
                </span>
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-[color:var(--color-on-surface)]">{item.title}</p>
                  <p className="text-base leading-relaxed text-[color:var(--color-on-surface)]/80">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="space-y-3 rounded-2xl bg-[color:var(--color-primary)]/10 p-5 text-[color:var(--color-on-surface)]">
            <p className="text-base leading-relaxed">
              Need a hand right now? Visit our{' '}
              <Link
                href="/help"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                help center
              </Link>{' '}
              or email{' '}
              <a
                href="mailto:hello@ilo.school"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                hello@ilo.school
              </a>
              .
            </p>
            <p className="text-sm text-[color:var(--color-on-surface)]/70">
              We respond within one business day and love hearing from guardians.
            </p>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
