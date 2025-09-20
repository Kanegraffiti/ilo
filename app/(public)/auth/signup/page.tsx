'use client';

import { AuthCard } from '@/components/ui/AuthCard';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { usePageEnter } from '@/lib/anim';
import { guardianSignupSchema } from '@/lib/zodSchemas';
import { motion } from 'framer-motion';
import {
  BookOpenCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  Globe,
  Heart,
  Lock,
  Mail,
  Sparkles,
  User,
} from 'lucide-react';
import { type FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';

const passwordAuthEnabled = process.env.NEXT_PUBLIC_SUPABASE_PASSWORD_AUTH === 'true';

const displayNameSchema = guardianSignupSchema.shape.displayName;
const countrySchema = guardianSignupSchema.shape.country;
const passwordFieldSchema = guardianSignupSchema.shape.password;
const emailFieldSchema = guardianSignupSchema.shape.email;

type Notice = { variant: 'success' | 'error'; message: string } | null;

type SignupErrors = {
  email: string | null;
  displayName: string | null;
  country: string | null;
  password: string | null;
};

const COUNTRIES = [
  'Nigeria',
  'Ghana',
  'Kenya',
  'South Africa',
  'United States',
  'United Kingdom',
  'Canada',
  'France',
  'Germany',
  'Other',
] as const;

function getEmailError(value: string): string | null {
  const parsed = emailFieldSchema.safeParse(value);
  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? 'Please enter a valid email address.';
  }
  return null;
}

function getDisplayNameError(value: string): string | null {
  const parsed = displayNameSchema.safeParse(value);
  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? 'Please tell us your name.';
  }
  return null;
}

function getCountryError(value: string): string | null {
  if (!value) {
    return null;
  }
  const parsed = countrySchema.safeParse(value);
  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? 'Please choose a country or select Other.';
  }
  return null;
}

function getPasswordError(value: string): string | null {
  if (!passwordAuthEnabled || !value) {
    return null;
  }
  const parsed = passwordFieldSchema.safeParse(value);
  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? 'Passwords must be at least 8 characters.';
  }
  return null;
}

export default function SignupPage() {
  const motionProps = usePageEnter();

  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [country, setCountry] = useState('');
  const [password, setPassword] = useState('');
  const [updatesOptIn, setUpdatesOptIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, displayName: false, country: false, password: false });
  const [errors, setErrors] = useState<SignupErrors>({ email: null, displayName: null, country: null, password: null });
  const [notice, setNotice] = useState<Notice>(null);
  const [loading, setLoading] = useState(false);

  const countryOptions = useMemo(() => COUNTRIES.map((value) => ({ value, label: value })), []);

  const stepItems = useMemo(
    () => [
      {
        title: 'Guardian details',
        description: 'Share your name and email so we know who to send magic links to.',
        status: 'current' as const,
      },
      {
        title: 'Confirm your email',
        description: 'Tap the Yoruba link in your inbox to prove it’s really you.',
        status: 'upcoming' as const,
      },
      {
        title: 'Add child profiles',
        description: 'Create joyful spaces for each learner after sign-up.',
        status: 'upcoming' as const,
      },
    ],
    [],
  );

  const highlightItems = useMemo(
    () => [
      {
        title: 'Culture-rich stories',
        description: 'Unlock songs, folktales, and call-and-response activities made for Yoruba learners.',
        icon: <Sparkles className="h-6 w-6" aria-hidden="true" />,
      },
      {
        title: 'Family-friendly controls',
        description: 'Switch between child profiles without sharing devices or passwords.',
        icon: <Heart className="h-6 w-6" aria-hidden="true" />,
      },
      {
        title: 'Progress at a glance',
        description: 'See streaks, stars, and badges so you can celebrate every milestone.',
        icon: <BookOpenCheck className="h-6 w-6" aria-hidden="true" />,
      },
    ],
    [],
  );

  const showEmailSuccess = touched.email && !errors.email && email.length > 0;
  const showDisplayNameSuccess = touched.displayName && !errors.displayName && displayName.length > 0;
  const showCountrySuccess = touched.country && !errors.country && Boolean(country);
  const showPasswordSuccess =
    passwordAuthEnabled && touched.password && !errors.password && password.length > 0;

  const emailHelper = showEmailSuccess
    ? 'Great! We’ll send confirmation to this address.'
    : 'We’ll use this email to send you a safe magic link.';
  const nameHelper = showDisplayNameSuccess
    ? 'Thanks! Kids will see this name in their dashboard.'
    : 'This helps kids recognise who is guiding them.';
  const countryHelper = showCountrySuccess
    ? `Nice! We’ll tailor stories for learners in ${country}.`
    : 'We use this to tailor stories and time zones.';
  const passwordHelper = passwordAuthEnabled
    ? showPasswordSuccess
      ? 'Perfect! Keep this password private.'
      : 'Use at least 8 characters with a mix of letters and numbers.'
    : undefined;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emailIssue = getEmailError(email);
    const nameIssue = getDisplayNameError(displayName);
    const countryIssue = getCountryError(country);
    const passwordIssue = getPasswordError(password);

    const fieldErrors: SignupErrors = {
      email: emailIssue,
      displayName: nameIssue,
      country: countryIssue,
      password: passwordIssue,
    };

    setErrors(fieldErrors);
    setTouched({ email: true, displayName: true, country: true, password: true });

    if (emailIssue || nameIssue || countryIssue || passwordIssue) {
      return;
    }

    setNotice(null);
    setLoading(true);

    try {
      const payload = {
        email,
        displayName,
        country: country || undefined,
        password: passwordAuthEnabled ? password : undefined,
        updatesOptIn,
      };
      const parsed = guardianSignupSchema.safeParse(payload);
      if (!parsed.success) {
        const flattened = parsed.error.flatten();
        setErrors({
          email: flattened.fieldErrors.email?.[0] ?? null,
          displayName: flattened.fieldErrors.displayName?.[0] ?? null,
          country: flattened.fieldErrors.country?.[0] ?? null,
          password: flattened.fieldErrors.password?.[0] ?? null,
        });
        return;
      }

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const data = (await response.json().catch(() => null)) as { ok?: boolean; message?: string } | null;

      if (response.ok && data?.ok) {
        setNotice({ variant: 'success', message: data.message ?? 'Check your email to finish signing in securely.' });
      } else {
        setNotice({
          variant: 'error',
          message: data?.message ?? 'We could not create that account right now. Please try again soon.',
        });
      }
    } catch (error) {
      setNotice({
        variant: 'error',
        message: 'Something went wrong while creating your account. Please try again soon.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      {...motionProps}
      className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-10 sm:px-6 lg:px-8"
    >
      <header className="space-y-4 text-center sm:text-left">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent)]/15 px-4 py-2 text-sm font-semibold text-[color:var(--color-accent)] sm:mx-0">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          <span>Start your guardian journey</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-serif c-on-paper sm:text-5xl">Create your account</h1>
          <p className="text-lg leading-relaxed c-on-paper opacity-80 sm:max-w-2xl">
            Grown-ups sign up first so you can add playful child profiles and keep everyone safe.
          </p>
        </div>
      </header>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <AuthCard
          title="Guardian sign up"
          description="We’ll send a link to verify your email and keep little learners protected."
          icon={<Sparkles className="h-7 w-7" aria-hidden="true" />}
          eyebrow="Step 1"
          headerTone="accent"
        >
          <div className="space-y-6">
            <ol className="grid gap-4 rounded-2xl border border-[color:var(--color-accent)]/20 bg-[color:var(--color-accent)]/10 p-4 sm:grid-cols-3">
              {stepItems.map((step, index) => {
                const isCurrent = step.status === 'current';
                return (
                  <li
                    key={step.title}
                    className={`space-y-1 rounded-2xl p-3 text-[color:var(--color-on-surface)] ${
                      isCurrent ? 'bg-[color:var(--color-surface)] shadow-sm' : 'bg-transparent'
                    }`}
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                      Step {index + 1}
                    </span>
                    <p className="text-base font-semibold">{step.title}</p>
                    <p className="text-sm leading-relaxed text-[color:var(--color-on-surface)]/80">
                      {step.description}
                    </p>
                  </li>
                );
              })}
            </ol>
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              {notice ? <Alert variant={notice.variant}>{notice.message}</Alert> : null}
              <Input
                label="Email address"
                type="email"
                value={email}
                leadingIcon={<Mail className="h-5 w-5 text-[color:var(--color-primary)]" aria-hidden="true" />}
                trailingIcon={
                  showEmailSuccess ? (
                    <CheckCircle2 className="h-5 w-5 text-[color:var(--color-primary)]" aria-hidden="true" />
                  ) : undefined
                }
                onChange={(event) => {
                  const nextValue = event.target.value;
                  setEmail(nextValue);
                  if (touched.email) {
                    setErrors((prev) => ({ ...prev, email: getEmailError(nextValue) }));
                  }
                  if (notice) {
                    setNotice(null);
                  }
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, email: true }));
                  setErrors((prev) => ({ ...prev, email: getEmailError(email) }));
                }}
                helperText={emailHelper}
                errorText={errors.email ?? undefined}
                autoComplete="email"
                required
              />
              <Input
                label="Display name"
                value={displayName}
                leadingIcon={<User className="h-5 w-5 text-[color:var(--color-primary)]" aria-hidden="true" />}
                trailingIcon={
                  showDisplayNameSuccess ? (
                    <CheckCircle2 className="h-5 w-5 text-[color:var(--color-primary)]" aria-hidden="true" />
                  ) : undefined
                }
                onChange={(event) => {
                  const nextValue = event.target.value;
                  setDisplayName(nextValue);
                  if (touched.displayName) {
                    setErrors((prev) => ({ ...prev, displayName: getDisplayNameError(nextValue) }));
                  }
                  if (notice) {
                    setNotice(null);
                  }
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, displayName: true }));
                  setErrors((prev) => ({ ...prev, displayName: getDisplayNameError(displayName) }));
                }}
                helperText={nameHelper}
                errorText={errors.displayName ?? undefined}
                autoComplete="name"
                required
              />
              <Select
                label="Country"
                value={country}
                leadingIcon={<Globe className="h-5 w-5 text-[color:var(--color-primary)]" aria-hidden="true" />}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  setCountry(nextValue);
                  if (touched.country) {
                    setErrors((prev) => ({ ...prev, country: getCountryError(nextValue) }));
                  }
                  if (notice) {
                    setNotice(null);
                  }
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, country: true }));
                  setErrors((prev) => ({ ...prev, country: getCountryError(country) }));
                }}
                helperText={countryHelper}
                errorText={errors.country ?? undefined}
              >
                <option value="">Select a country</option>
                {countryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              {passwordAuthEnabled ? (
                <Input
                  label="Create a password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  leadingIcon={<Lock className="h-5 w-5 text-[color:var(--color-primary)]" aria-hidden="true" />}
                  trailingIcon={
                    showPasswordSuccess ? (
                      <CheckCircle2 className="h-5 w-5 text-[color:var(--color-primary)]" aria-hidden="true" />
                    ) : undefined
                  }
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    setPassword(nextValue);
                    if (touched.password) {
                      setErrors((prev) => ({ ...prev, password: getPasswordError(nextValue) }));
                    }
                    if (notice) {
                      setNotice(null);
                    }
                  }}
                  onBlur={() => {
                    setTouched((prev) => ({ ...prev, password: true }));
                    setErrors((prev) => ({ ...prev, password: getPasswordError(password) }));
                  }}
                  helperText={passwordHelper}
                  errorText={errors.password ?? undefined}
                  autoComplete="new-password"
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
              ) : null}
              <label className="flex items-start gap-3 rounded-2xl border border-[color:var(--color-on-surface)]/15 bg-[color:var(--color-on-surface)]/5 p-4 text-[color:var(--color-on-surface)]">
                <input
                  type="checkbox"
                  className="mt-1 h-5 w-5 rounded border-[color:var(--color-on-surface)]/30 focus:ring-[color:var(--color-accent)]"
                  checked={updatesOptIn}
                  onChange={(event) => setUpdatesOptIn(event.target.checked)}
                  style={{ accentColor: 'var(--color-primary)' }}
                />
                <span className="space-y-1">
                  <span className="block text-base font-semibold">Send me playful Yoruba tips</span>
                  <span className="block text-sm text-[color:var(--color-on-surface)]/70">
                    Optional monthly email with culture bites and new lesson alerts.
                  </span>
                </span>
              </label>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Creating account…' : 'Create guardian account'}
              </Button>
              <p className="text-sm text-[color:var(--color-on-surface)]/70">
                We’ll email a verification link right away. Confirm it to start adding child profiles.
              </p>
            </form>
            <Divider>After sign up</Divider>
            <div className="space-y-4 rounded-2xl border border-[color:var(--color-on-surface)]/10 bg-[color:var(--color-on-surface)]/5 p-5">
              <p className="text-base leading-relaxed text-[color:var(--color-on-surface)]">
                After you confirm the magic link, you can add child profiles so each kid has their own joyful space.
              </p>
              <Button href="/kids" variant="secondary" className="w-full sm:w-auto">
                Add a child profile
              </Button>
            </div>
            <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-base text-[color:var(--color-on-surface)]">Already have an account?</p>
              <Button href="/auth/login" variant="ghost" className="w-full sm:w-auto">
                Log in instead
              </Button>
            </div>
          </div>
        </AuthCard>
        <section className="space-y-6 rounded-3xl bg-[color:var(--color-surface)]/70 p-6 ring-1 ring-[color:var(--color-on-surface)]/10 backdrop-blur-sm">
          <h2 className="text-2xl font-serif leading-tight text-[color:var(--color-on-surface)]">What you unlock</h2>
          <p className="text-base leading-relaxed text-[color:var(--color-on-surface)]/80">
            Your guardian account anchors every child profile, tracks their streaks, and lets you celebrate in Yoruba and English.
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
                  <p className="text-base leading-relaxed text-[color:var(--color-on-surface)]/80">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="space-y-3 rounded-2xl bg-[color:var(--color-primary)]/10 p-5 text-[color:var(--color-on-surface)]">
            <p className="text-base leading-relaxed">
              Prefer to talk to a person first? We’re ready to help at{' '}
              <a
                href="mailto:hello@ilo.school"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                hello@ilo.school
              </a>{' '}
              or visit our{' '}
              <Link href="/help" className="font-semibold text-primary underline-offset-4 hover:underline">
                help center
              </Link>
              .
            </p>
            <p className="text-sm text-[color:var(--color-on-surface)]/70">
              We share monthly recaps and Yoruba celebration ideas with guardians who opt in.
            </p>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
