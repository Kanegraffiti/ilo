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
