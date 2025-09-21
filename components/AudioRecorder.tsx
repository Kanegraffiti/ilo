'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { useToast } from '@/components/ui/Toast';
import { usePrefersReducedMotion } from '@/lib/anim';
import { cn } from '@/lib/utils';
import { openDB } from 'idb';
import { Loader2, Mic, RefreshCw, UploadCloud } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface QueuedRecording {
  id: string;
  lessonId: string;
  createdAt: number;
  blob: Blob;
}

const DB_NAME = 'ilo-practice-recordings';
const STORE_NAME = 'pending-recordings';

async function getDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
}

async function queueRecording(entry: QueuedRecording) {
  const db = await getDb();
  await db.put(STORE_NAME, entry);
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    const registration = await navigator.serviceWorker.ready;
    try {
      await (registration as ServiceWorkerRegistration & { sync?: { register: (tag: string) => Promise<void> } }).sync?.register(
        'practice-recordings',
      );
    } catch (error) {
      // Sync registration is optional; ignore errors silently.
    }
  }
}

async function getQueuedRecordings() {
  const db = await getDb();
  return db.getAll(STORE_NAME);
}

async function removeQueuedRecording(id: string) {
  const db = await getDb();
  await db.delete(STORE_NAME, id);
}

export interface AudioRecorderProps {
  lessonId: string;
  onSubmit: (blob: Blob) => Promise<void>;
  className?: string;
}

type RecorderState = 'idle' | 'recording' | 'review';

export function AudioRecorder({ lessonId, onSubmit, className }: AudioRecorderProps) {
  const [state, setState] = useState<RecorderState>('idle');
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [queuedCount, setQueuedCount] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { push } = useToast();
  const prefersReducedMotion = usePrefersReducedMotion();

  const refreshQueuedCount = useCallback(async () => {
    const queued = await getQueuedRecordings();
    setQueuedCount(queued.length);
  }, []);

  const flushQueue = useCallback(async () => {
    const queued = await getQueuedRecordings();
    if (!queued.length) {
      setQueuedCount(0);
      return;
    }

    for (const entry of queued) {
      try {
        await onSubmit(entry.blob);
        await removeQueuedRecording(entry.id);
        push({
          title: 'Uploaded saved practice',
          description: 'Your earlier recording is now shared. Ẹ ṣe!',
          tone: 'success',
        });
      } catch (error) {
        // If upload fails, stop processing to retry later.
        break;
      }
    }

    await refreshQueuedCount();
  }, [onSubmit, push, refreshQueuedCount]);

  useEffect(() => {
    refreshQueuedCount();
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      flushQueue().catch(() => {
        /* no-op */
      });
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [flushQueue, refreshQueuedCount]);

  const stopAll = () => {
    if (mediaRecorderRef.current) {
      const { stream } = mediaRecorderRef.current;
      mediaRecorderRef.current.stop();
      stream.getTracks().forEach((track) => track.stop());
      mediaRecorderRef.current = null;
    }
  };

  const startRecording = async () => {
    if (!('mediaDevices' in navigator)) {
      push({
        title: 'Recording not supported',
        description: 'Your browser cannot capture audio here. Try a different device.',
        tone: 'error',
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        chunksRef.current = [];
        setRecordedBlob(blob);
        setPreviewUrl((current) => {
          if (current) URL.revokeObjectURL(current);
          return URL.createObjectURL(blob);
        });
        setState('review');
      };
      recorder.start();
      setState('recording');
      setPermissionDenied(false);
    } catch (error) {
      setPermissionDenied(true);
      push({
        title: 'Permission needed',
        description: 'Please allow microphone access to record pronunciation.',
        tone: 'error',
      });
    }
  };

  const stopRecording = () => {
    stopAll();
  };

  const resetRecording = () => {
    stopAll();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setRecordedBlob(null);
    setState('idle');
  };

  const submitRecording = async () => {
    if (!recordedBlob) {
      return;
    }

    const enqueue = async () => {
      const entry: QueuedRecording = {
        id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Date.now().toString(),
        lessonId,
        createdAt: Date.now(),
        blob: recordedBlob,
      };
      await queueRecording(entry);
      await refreshQueuedCount();
      push({
        title: 'Saved offline — will upload when online.',
        description: 'We’ll send your practice as soon as you’re connected.',
        tone: 'info',
      });
    };

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      await enqueue();
      resetRecording();
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(recordedBlob);
      push({
        title: 'Great effort!',
        description: 'Your pronunciation is on its way to your mentor.',
        tone: 'success',
      });
      resetRecording();
    } catch (error) {
      await enqueue();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className={cn('bg-white/90', className)}>
      <div className="space-y-4">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-2xl font-serif">Pronunciation practice</h3>
            <p className="text-lg text-ink/70">Press the tortoise button and speak clearly. Ẹ káàárọ̀!</p>
          </div>
          {queuedCount > 0 ? (
            <Chip tone="warning" size="sm">
              {queuedCount} saved offline
            </Chip>
          ) : null}
        </header>
        <div className="flex flex-col items-center justify-center gap-4">
          <button
            type="button"
            onClick={state === 'recording' ? stopRecording : startRecording}
            className={cn(
              'relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-primary bg-primary/90 text-paper shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/40',
              state === 'recording' ? 'animate-pulse bg-accent/90' : '',
            )}
            aria-label={state === 'recording' ? 'Stop recording' : 'Start recording'}
          >
            <Mic className="h-14 w-14" />
            {state === 'recording' && !prefersReducedMotion ? (
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full border-4 border-accent/30 animate-ping"
              />
            ) : null}
          </button>
          <p className="text-lg text-ink/70">
            {permissionDenied
              ? 'Microphone access is blocked — allow access in your browser settings.'
              : state === 'recording'
              ? 'Listening… say the phrase slowly.'
              : 'Tap the button to begin. Recordings are kept private.'}
          </p>
        </div>
        {previewUrl ? (
          <div className="space-y-3">
            <audio className="w-full" controls src={previewUrl} />
            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                leadingIcon={submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <UploadCloud className="h-5 w-5" />}
                onClick={submitRecording}
                disabled={submitting}
              >
                {submitting ? 'Sending…' : 'Submit recording'}
              </Button>
              <Button variant="ghost" leadingIcon={<RefreshCw className="h-5 w-5" />} onClick={resetRecording}>
                Try again?
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
