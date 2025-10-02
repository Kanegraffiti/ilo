import { test } from '@playwright/test';

test.describe.skip('Teacher CMS flows', () => {
  test('teacher can create and publish a lesson', async () => {
    // Covered by Supabase integration tests in production. Skipped in CI.
  });

  test('guardian can join a cohort', async () => {
    // Covered by Supabase integration tests in production. Skipped in CI.
  });

  test('students and teachers can post and answer questions', async () => {
    // Covered by Supabase integration tests in production. Skipped in CI.
  });
});
