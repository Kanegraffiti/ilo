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

export const cohortCreateSchema = z.object({
  name: z
    .string({ required_error: 'Please enter a cohort name.' })
    .trim()
    .min(2, 'Cohort name must be at least 2 characters long.')
    .max(120, 'Please keep the cohort name under 120 characters.'),
  description: z
    .string()
    .trim()
    .max(300, 'Please keep the description shorter than 300 characters.')
    .optional()
    .transform((value) => (value && value.length > 0 ? value : undefined)),
});

export type CohortCreateInput = z.infer<typeof cohortCreateSchema>;

export const cohortEnrollSchema = z.object({
  ownerKind: z.enum(['user', 'child']),
  ownerId: z.string().uuid(),
});

export type CohortEnrollInput = z.infer<typeof cohortEnrollSchema>;

const vocabSchema = z.object({
  term: z.string().min(1, 'Enter the Yorùbá term.'),
  translation: z.string().min(1, 'Enter the translation.'),
});

const mediaSchema = z.object({
  fileName: z.string().min(1, 'File needs a name.'),
  contentType: z.string().min(1, 'File must include a content type.'),
});

export const lessonUpsertSchema = z
  .object({
    lessonId: z.string().uuid().optional(),
    title: z
      .string({ required_error: 'Title is required.' })
      .trim()
      .min(3, 'Give the lesson a title with at least 3 characters.')
      .max(160, 'Please choose a shorter title.'),
    status: z.enum(['draft', 'published']).default('draft'),
    moduleId: z
      .string()
      .uuid({ message: 'Module ID must be a valid UUID.' })
      .optional(),
    moduleTitle: z
      .string()
      .trim()
      .max(160, 'Module title is too long.')
      .optional()
      .transform((value) => (value && value.length > 0 ? value : undefined)),
    objectives: z
      .array(z.string().trim().min(2, 'Objective needs at least 2 characters.'))
      .max(12, 'Please limit to 12 objectives.')
      .default([]),
    notesMd: z
      .string({ required_error: 'Add lesson notes.' })
      .trim()
      .min(10, 'Add a little more detail for the notes.'),
    vocab: z.array(vocabSchema).max(30, 'Please limit to 30 vocabulary entries.').default([]),
    media: z.array(mediaSchema).max(10, 'Please limit to 10 media uploads.').default([]),
  })
  .refine((data) => Boolean(data.moduleId || data.moduleTitle), {
    message: 'Select a module or provide a new module name.',
    path: ['moduleId'],
  });

export type LessonUpsertInput = z.infer<typeof lessonUpsertSchema>;

export const questionCreateSchema = z.object({
  lessonId: z.string().uuid(),
  ownerKind: z.enum(['user', 'child']),
  ownerId: z.string().uuid(),
  question: z
    .string({ required_error: 'Please ask a question.' })
    .trim()
    .min(3, 'Please add a bit more detail to the question.')
    .max(500, 'Please keep questions shorter than 500 characters.'),
});

export type QuestionCreateInput = z.infer<typeof questionCreateSchema>;

export const questionAnswerSchema = z.object({
  answer: z
    .string({ required_error: 'Please provide an answer.' })
    .trim()
    .min(3, 'The answer should be at least 3 characters.')
    .max(2000, 'Please keep answers shorter than 2000 characters.'),
});

export type QuestionAnswerInput = z.infer<typeof questionAnswerSchema>;
