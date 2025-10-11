'use client';

import { useCardPop } from '@/lib/anim';
import { lessonUpsertSchema, type LessonUpsertInput } from '@/lib/zodSchemas';
import { motion } from 'framer-motion';
import { Loader2, Plus, Trash2, Upload } from 'lucide-react';
import { marked } from 'marked';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Button } from './ui/Button';
import { Chip } from './ui/Chip';
import { Input } from './ui/Input';
import { ToneKeypad } from './ToneKeypad';
import { TextArea } from './ui/TextArea';

interface TeacherLessonFormProps {
  lessonId?: string;
  initialValues?: Partial<LessonUpsertInput> & { status?: 'draft' | 'published'; title?: string };
  submitLabel?: string;
}

interface UploadJob {
  file: File;
  path: string;
  url: string;
}

interface ApiResponse {
  ok: boolean;
  message?: string;
  lessonId?: string;
  uploadUrls?: { path: string; url: string }[];
}

const emptyVocab = { term: '', translation: '' };

export function TeacherLessonForm({ lessonId, initialValues, submitLabel = 'Save lesson' }: TeacherLessonFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [status, setStatus] = useState<'draft' | 'published'>(initialValues?.status ?? 'draft');
  const [moduleId, setModuleId] = useState(initialValues?.moduleId ?? '');
  const [moduleTitle, setModuleTitle] = useState(initialValues?.moduleTitle ?? '');
  const [objectives, setObjectives] = useState<string[]>(initialValues?.objectives ?? []);
  const [notesMd, setNotesMd] = useState(initialValues?.notesMd ?? '');
  const [notesPreview, setNotesPreview] = useState(false);
  const [vocab, setVocab] = useState(initialValues?.vocab?.length ? initialValues.vocab : [emptyVocab]);
  const [media, setMedia] = useState<File[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [objectiveDraft, setObjectiveDraft] = useState('');
  const cardPop = useCardPop();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAddObjective = () => {
    const value = objectiveDraft.trim();
    if (!value) return;
    setObjectives((prev) => Array.from(new Set([...prev, value])));
    setObjectiveDraft('');
  };

  const removeObjective = (value: string) => {
    setObjectives((prev) => prev.filter((item) => item !== value));
  };

  const updateVocab = (index: number, key: 'term' | 'translation', value: string) => {
    setVocab((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  };

  const addVocabRow = () => {
    setVocab((prev) => [...prev, emptyVocab]);
  };

  const removeVocabRow = (index: number) => {
    setVocab((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const payload = {
      lessonId,
      title,
      status,
      moduleId: moduleId || undefined,
      moduleTitle: moduleTitle || undefined,
      objectives,
      notesMd,
      vocab: vocab
        .filter((item) => item.term.trim().length > 0 && item.translation.trim().length > 0)
        .map((item) => ({ term: item.term.trim(), translation: item.translation.trim() })),
      media: media.map((file) => ({ fileName: file.name, contentType: file.type })),
    } satisfies Partial<LessonUpsertInput> & { lessonId?: string };

    const parsed = lessonUpsertSchema.safeParse(payload);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      setError(flattened.formErrors[0] || 'Please fix the highlighted fields.');
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch(lessonId ? `/api/lessons/${lessonId}/update` : '/api/lessons/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed.data),
        });

        const body = (await response.json().catch(() => ({}))) as ApiResponse;
        if (!response.ok || !body.ok) {
          setError(body.message || 'We could not save the lesson.');
          return;
        }

        if (body.uploadUrls?.length && media.length) {
          const jobs: UploadJob[] = body.uploadUrls
            .map((upload, index) => ({ file: media[index], path: upload.path, url: upload.url }))
            .filter((job) => Boolean(job.file));

          for (const job of jobs) {
            await fetch(job.url, {
              method: 'PUT',
              headers: { 'Content-Type': job.file.type || 'application/octet-stream' },
              body: job.file,
            });
          }
        }

        setMessage('Lesson saved successfully.');
        setMedia([]);
        if (body.lessonId) {
          router.refresh();
          if (!lessonId) {
            router.push(`/teacher/lessons/${body.lessonId}/edit`);
          }
        }
      } catch (err) {
        console.error(err);
        setError('Something went wrong while saving the lesson.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="space-y-4">
        <header>
          <h2 className="text-2xl font-serif text-ink">Lesson details</h2>
          <p className="text-sm text-ink/70">Create engaging content with notes, vocab, and rich media.</p>
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-ink">Title</span>
            <Input
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ẹ káàárọ̀ greetings"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-ink">Status</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as 'draft' | 'published')}
              className="h-12 w-full rounded-2xl border border-ink/10 bg-white/90 px-4 font-semibold text-ink focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/30"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-ink">Module</span>
            <Input
              value={moduleId}
              onChange={(event) => setModuleId(event.target.value)}
              placeholder="Existing module ID"
            />
            <p className="text-xs text-ink/60">Paste an existing module ID or leave blank to create a new one.</p>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-ink">New module name</span>
            <Input
              value={moduleTitle}
              onChange={(event) => setModuleTitle(event.target.value)}
              placeholder="Household phrases"
            />
            <p className="text-xs text-ink/60">If provided, a module will be created and linked to this lesson.</p>
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <header className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl font-serif text-ink">Objectives</h2>
            <p className="text-sm text-ink/70">Capture short goals for learners.</p>
          </div>
          <div className="flex gap-2">
            <Input
              value={objectiveDraft}
              onChange={(event) => setObjectiveDraft(event.target.value)}
              placeholder="Build confidence"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddObjective}
              leadingIcon={<Plus className="h-4 w-4" />}
            >
              Add
            </Button>
          </div>
        </header>
        <div className="flex flex-wrap gap-2">
          {objectives.map((item) => (
            <Chip key={item} tone="secondary" size="sm" className="flex items-center gap-2">
              <span>{item}</span>
              <button
                type="button"
                onClick={() => removeObjective(item)}
                className="rounded-full bg-black/10 p-1 text-xs text-ink/70 hover:bg-black/20"
                aria-label={`Remove objective ${item}`}
              >
                ×
              </button>
            </Chip>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif text-ink">Teaching notes</h2>
            <p className="text-sm text-ink/70">Write Markdown notes for fellow teachers.</p>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={() => setNotesPreview((prev) => !prev)}>
            {notesPreview ? 'Edit Markdown' : 'Preview'}
          </Button>
        </header>
        {notesPreview ? (
          <motion.div
            {...cardPop}
            className="prose max-w-none rounded-2xl border border-ink/10 bg-white/90 p-4 text-ink"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(notesMd) }}
          />
        ) : (
          <div className="space-y-2">
            <TextArea
              value={notesMd}
              onChange={(event) => setNotesMd(event.target.value)}
              minRows={8}
              placeholder={'## Warm-up\nShare a song or call-and-response to begin.'}
            />
            <ToneKeypad onInsert={(value) => setNotesMd((prev) => `${prev}${value}`)} />
          </div>
        )}
      </section>

      <section className="space-y-4">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif text-ink">Vocabulary list</h2>
            <p className="text-sm text-ink/70">Add Yorùbá terms and translations.</p>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addVocabRow}
            leadingIcon={<Plus className="h-4 w-4" aria-hidden="true" />}
          >
            Add row
          </Button>
        </header>
        <div className="space-y-3">
          {vocab.map((entry, index) => (
            <motion.div
              key={`vocab-${index}`}
              {...cardPop}
              className="grid gap-3 rounded-2xl border border-ink/10 bg-surface-100/80 p-4 md:grid-cols-[1fr_auto]"
            >
              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  value={entry.term}
                  onChange={(event) => updateVocab(index, 'term', event.target.value)}
                  placeholder="Ẹ káàárọ̀"
                />
                <Input
                  value={entry.translation}
                  onChange={(event) => updateVocab(index, 'translation', event.target.value)}
                  placeholder="Good morning"
                />
              </div>
              <div className="flex items-center justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeVocabRow(index)}
                  aria-label="Remove vocabulary row"
                >
                  <Trash2 className="h-5 w-5" aria-hidden="true" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif text-ink">Upload media</h2>
            <p className="text-sm text-ink/70">Attach images, audio, or PDF guides for the lesson.</p>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-dashed border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20">
            <Upload className="h-4 w-4" aria-hidden="true" />
            Choose files
            <input
              type="file"
              multiple
              className="sr-only"
              onChange={(event) => {
                const files = Array.from(event.target.files ?? []);
                setMedia(files);
              }}
            />
          </label>
        </header>
        <ul className="space-y-2 text-sm text-ink/70">
          {media.length === 0 ? <li>No files selected yet.</li> : null}
          {media.map((file) => (
            <li key={file.name} className="flex items-center justify-between rounded-2xl bg-surface-100/80 px-3 py-2">
              <span className="truncate">{file.name}</span>
              <button
                type="button"
                className="text-xs font-semibold text-primary"
                onClick={() => setMedia((prev) => prev.filter((item) => item !== file))}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </section>

      {error ? <p className="rounded-2xl bg-error/10 px-4 py-3 text-sm font-semibold text-error">{error}</p> : null}
      {message ? <p className="rounded-2xl bg-success/10 px-4 py-3 text-sm font-semibold text-success">{message}</p> : null}

      <div className="flex items-center justify-end gap-3">
        <Button
          type="submit"
          disabled={isPending}
          leadingIcon={isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

function markdownToHtml(markdown: string): string {
  try {
    const html = marked.parse(markdown ?? '');
    return typeof html === 'string' ? html : '';
  } catch (error) {
    console.error('Markdown render error', error);
    return markdown.replace(/\n/g, '<br />');
  }
}
