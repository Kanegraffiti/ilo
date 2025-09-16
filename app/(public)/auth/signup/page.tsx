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
import { Sparkles } from 'lucide-react';
import { type FormEvent, useMemo, useState } from 'react';

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
  const [touched, setTouched] = useState({ email: false, displayName: false, country: false, password: false });
  const [errors, setErrors] = useState<SignupErrors>({ email: null, displayName: null, country: null, password: null });
  const [notice, setNotice] = useState<Notice>(null);
  const [loading, setLoading] = useState(false);

  const countryOptions = useMemo(() => COUNTRIES.map((value) => ({ value, label: value })), []);

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
    <motion.div {...motionProps} className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-serif c-on-paper">Create your account</h1>
        <p className="text-lg leading-relaxed c-on-paper">
          Grown-ups sign up first so you can add playful child profiles and keep everyone safe.
        </p>
      </header>
      <AuthCard
        title="Guardian sign up"
        description="We’ll send a link to verify your email and keep little learners protected."
        icon={<Sparkles className="h-7 w-7" aria-hidden="true" />}
        eyebrow="Step 1"
      >
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          {notice ? <Alert variant={notice.variant}>{notice.message}</Alert> : null}
          <Input
            label="Email address"
            type="email"
            value={email}
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
            helperText="We’ll use this email to send you a safe magic link."
            errorText={errors.email ?? undefined}
            autoComplete="email"
            required
          />
          <Input
            label="Display name"
            value={displayName}
            onChange={(event) => {
              const nextValue = event.target.value;
              setDisplayName(nextValue);
              if (touched.displayName) {
                setErrors((prev) => ({ ...prev, displayName: getDisplayNameError(nextValue) }));
              }
            }}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, displayName: true }));
              setErrors((prev) => ({ ...prev, displayName: getDisplayNameError(displayName) }));
            }}
            helperText="This helps kids recognise who is guiding them."
            errorText={errors.displayName ?? undefined}
            autoComplete="name"
            required
          />
          <Select
            label="Country"
            value={country}
            onChange={(event) => {
              const nextValue = event.target.value;
              setCountry(nextValue);
              if (touched.country) {
                setErrors((prev) => ({ ...prev, country: getCountryError(nextValue) }));
              }
            }}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, country: true }));
              setErrors((prev) => ({ ...prev, country: getCountryError(country) }));
            }}
            helperText="We use this to tailor stories and time zones."
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
              type="password"
              value={password}
              onChange={(event) => {
                const nextValue = event.target.value;
                setPassword(nextValue);
                if (touched.password) {
                  setErrors((prev) => ({ ...prev, password: getPasswordError(nextValue) }));
                }
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, password: true }));
                setErrors((prev) => ({ ...prev, password: getPasswordError(password) }));
              }}
              helperText="Use at least 8 characters with a mix of letters and numbers."
              errorText={errors.password ?? undefined}
              autoComplete="new-password"
            />
          ) : null}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating account…' : 'Create account'}
          </Button>
        </form>
        <Divider>Next steps</Divider>
        <div className="space-y-4 rounded-2xl bg-[color:var(--color-on-surface)]/5 p-5">
          <p className="text-base leading-relaxed c-on-surface">
            After you confirm the magic link, you can add child profiles so each kid has their own joyful space.
          </p>
          <Button href="/kids" variant="secondary" className="w-full sm:w-auto">
            Add a child profile
          </Button>
        </div>
        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-base c-on-surface">Already have an account?</p>
          <Button href="/auth/login" variant="ghost" className="w-full sm:w-auto">
            Log in instead
          </Button>
        </div>
      </AuthCard>
    </motion.div>
  );
}
