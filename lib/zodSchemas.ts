import { z } from 'zod';

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
