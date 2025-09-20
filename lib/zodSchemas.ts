import { z } from 'zod';

export const emailSchema = z
  .string({ required_error: 'Please enter an email address.' })
  .trim()
  .min(1, 'Email is required.')
  .email('Please use a valid email address.')
  .transform((value) => value.toLowerCase());

const passwordComplexity = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

export const passwordSchema = z
  .string({ required_error: 'Please enter a password.' })
  .min(8, 'Use at least 8 characters for your password.')
  .regex(passwordComplexity, 'Include upper and lowercase letters and a number.');

export const guardianSignupSchema = z.object({
  email: emailSchema,
  displayName: z
    .string({ required_error: 'Please share your name.' })
    .trim()
    .min(2, 'Please enter at least 2 characters.')
    .max(80, 'Please use a shorter name.'),
  country: z
    .string()
    .trim()
    .max(56, 'Please select a valid country.')
    .optional()
    .transform((value) => (value && value.length > 0 ? value : undefined)),
  password: z
    .union([passwordSchema, z.literal('')])
    .optional()
    .transform((value) => (value ? value : undefined)),
  updatesOptIn: z.boolean().optional().default(false),
});

export type GuardianSignupInput = z.infer<typeof guardianSignupSchema>;

export const submissionSchema = z.object({
  id: z.string().uuid().optional(),
  lesson_id: z.string().uuid(),
  type: z.enum(['quiz', 'voice']),
  payload: z.any(),
  media_path: z.string().optional(),
  score: z.number().optional(),
});

export const lessonIdParam = z.object({ id: z.string().uuid() });

export const profileSchema = z.object({
  user_id: z.string().uuid(),
  display_name: z.string().min(1),
  avatar_url: z.string().url().optional().nullable(),
  country: z.string().optional().nullable(),
  age: z.number().int().min(0).optional().nullable(),
});

export const childSchema = z.object({
  guardian_user_id: z.string().uuid(),
  nickname: z.string().min(1),
  age: z.number().int().min(4).max(12),
  avatar_url: z.string().url().optional().nullable(),
});

export const scoreCommitSchema = z.object({
  owner_kind: z.enum(['user', 'child']),
  owner_id: z.string().uuid(),
  module_id: z.string().uuid().optional().nullable(),
  lesson_id: z.string().uuid().optional().nullable(),
  xp: z.number().int().min(0),
  streak_days: z.number().int().min(0).optional().nullable(),
  nonce: z.string().min(1),
});
