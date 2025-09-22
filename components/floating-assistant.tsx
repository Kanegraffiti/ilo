'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Loader2, Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const INITIAL_MESSAGE: ChatMessage = {
  role: 'assistant',
  content: 'Káàbọ̀! I am Ìrànlọ́wọ́ Ìlọ̀. Ask me about the app or practise Yorùbá—mo máa dahùn ní èdè méjì.',
};

type ChatMessage = {
  role: 'assistant' | 'user';
  content: string;
};

type GenerationPipeline = (prompt: string, options?: Record<string, unknown>) => Promise<
  Array<{
    generated_text: string;
  }>
>;

const TOPIC_HINTS = [
  'What makes Ìlọ̀ special for kids?',
  'How do I install the Ìlọ̀ app?',
  'Ṣe o lè bá mi ṣe ìjíròrò ní Yorùbá?',
];

function buildPrompt(history: ChatMessage[]): string {
  const knowledge = `Ìlọ̀ jẹ́ ohun èlò ìmọ̀ Yorùbá fún àwọn ọmọ ọdún 4 sí 12. Ó ní:\n- Àwọn ẹ̀kọ́ kékèké pẹ̀lú orin, ìtàn, àti àwọn ìdánwò tí ń fún ọmọ ní ami àṣeyọrí.\n- Ìfipamọ́ lórí ẹrọ lẹ́yìn tí ẹ̀kọ́ bá gba lati ṣiṣẹ́ láìsí intanẹti.\n- Àwọn olùtọ́jú lè tọ́pa streak, ṣàtúnṣe profaili ọmọ, kí wọ́n sì gba ìròyìn pẹ̀lú àánú.\n- Ètò owó: Starter jẹ́ ọfẹ́ fún module kan; Teacher Pro jẹ́ ₦10,000 fun oṣù, ó ní dashboard àti ijẹ́rìí; Schools plan béèrè fún ìbánisọ̀rọ̀.\n- Awọn olùkọ́ lè kan si wa ní ojú-ìwé Iranlọwọ̀ fún ìfọwọ́sowọ́pọ̀ tabi ìbéèrè.\n- Ìtọsọ́nà fifi sori ẹrọ PWA wà lórí oju-ìwé Install.\n`; // eslint-disable-line max-len

  const guidelines =
    'You are Ìrànlọ́wọ́ Ìlọ̀, a cheerful Yoruba learning assistant. Reply warmly, weaving Yorùbá and English together. Give short, clear answers (max four sentences) and, when teaching Yorùbá, pair phrases with simple translations. Keep the chat focused on Ìlọ̀ or Yoruba learning. If a question falls outside those topics, gently guide them back.';

  const trimmedHistory = history.slice(-6);
  const conversation = trimmedHistory
    .map((message) => `${message.role === 'user' ? 'Guardian' : 'Ìrànlọ́wọ́'}: ${message.content}`)
    .join('\n');

  return `${guidelines}\n\nApp info:\n${knowledge}\nConversation so far:\n${conversation}\nÌrànlọ́wọ́:`;
}

function sanitizeResponse(text: string): string {
  return text
    .replace(/^["“”]+|["“”]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function FloatingAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loadingReply, setLoadingReply] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const generatorRef = useRef<GenerationPipeline | null>(null);
  const latestMessagesRef = useRef<ChatMessage[]>(messages);

  useEffect(() => {
    latestMessagesRef.current = messages;
  }, [messages]);

  const scrollToLatest = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!open) return;
    scrollToLatest();
  }, [open, messages, loadingReply, scrollToLatest]);

  const ensureGenerator = useCallback(async () => {
    if (generatorRef.current) {
      return generatorRef.current;
    }
    setModelLoading(true);
    try {
      const mod = await import('@xenova/transformers');
      const { pipeline, env } = mod as typeof import('@xenova/transformers');
      env.allowLocalModels = false;
      const backends = env.backends as Record<string, unknown> & { onnx?: { wasm?: { wasmPaths?: string } } };
      const onnx = backends?.onnx;
      if (onnx?.wasm) {
        onnx.wasm.wasmPaths =
          onnx.wasm.wasmPaths ?? 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/';
      }
      const generator = (await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-77M', {
        quantized: true,
      })) as GenerationPipeline;
      generatorRef.current = generator;
      return generator;
    } catch (loadError) {
      console.error(loadError);
      setError('Mo bínú—Ìrànlọ́wọ́ kò le dé báyìí. Jọwọ tún gbìyànjú lẹ́ẹ̀kansi.');
      throw loadError;
    } finally {
      setModelLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    void ensureGenerator();
  }, [open, ensureGenerator]);

  const exampleHint = useMemo(() => {
    const remaining = TOPIC_HINTS.filter((hint) => !messages.some((msg) => msg.content.includes(hint)));
    return remaining[Math.floor(Math.random() * remaining.length)] ?? TOPIC_HINTS[0];
  }, [messages]);

  const handleSubmit = useCallback(
    async (event?: React.FormEvent<HTMLFormElement>) => {
      event?.preventDefault();
      const trimmed = input.trim();
      if (!trimmed || loadingReply) {
        return;
      }

      const userMessage: ChatMessage = { role: 'user', content: trimmed };
      const withUser = [...latestMessagesRef.current, userMessage];
      setMessages(withUser);
      latestMessagesRef.current = withUser;
      setInput('');
      setError(null);
      setLoadingReply(true);

      try {
        const generator = await ensureGenerator();
        const prompt = buildPrompt(withUser);
        const result = await generator(prompt, {
          max_new_tokens: 180,
          temperature: 0.75,
          repetition_penalty: 1.1,
        });
        const rawText = result?.[0]?.generated_text ?? '';
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content:
            sanitizeResponse(rawText) ||
            'Ẹ ṣeun! Mo tún lè ràn ọ́ lọ́wọ́ pẹ̀lú ìbéèrè míì—kan béèrè.',
        };
        const updated = [...withUser, assistantMessage];
        setMessages(updated);
        latestMessagesRef.current = updated;
      } catch (generationError) {
        console.error(generationError);
        const fallback: ChatMessage = {
          role: 'assistant',
          content:
            'Aṣìṣe kan wáyé nígbà tí mo ń gbìyànjú láti dahùn. Ṣayẹwo asopọ ayélujára rẹ tàbí tún béèrè lẹ́ẹ̀kansi, jọ̀ọ́.',
        };
        const updated = [...withUser, fallback];
        setMessages(updated);
        latestMessagesRef.current = updated;
      } finally {
        setLoadingReply(false);
      }
    },
    [ensureGenerator, input, loadingReply],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        void handleSubmit();
      }
    },
    [handleSubmit],
  );

  return (
    <div aria-live="polite" aria-busy={loadingReply || modelLoading}>
      {open ? (
        <div
          id="ilo-assistant"
          className="fixed bottom-24 right-4 z-50 w-[min(340px,calc(100vw-2rem))] animate-in fade-in zoom-in"
        >
          <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-2xl">
            <header className="flex items-center justify-between bg-primary px-4 py-3 text-white">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                  <Bot className="h-6 w-6" aria-hidden="true" />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold">Ìrànlọ́wọ́ Ìlọ̀</p>
                  <p className="text-xs text-white/80">Ask about lessons or chat in Yorùbá.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-1 text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                aria-label="Close Ìrànlọ́wọ́ chat"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </header>
            <div className="max-h-80 overflow-y-auto bg-white px-4 py-3 text-sm text-ink/90">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn('mb-3 flex', message.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-3 py-2 shadow-sm',
                      message.role === 'user'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-cream text-ink',
                    )}
                  >
                    <p>{message.content}</p>
                  </div>
                </div>
              ))}
              {(modelLoading || loadingReply) && (
                <div className="mb-3 flex justify-start text-ink/70">
                  <div className="flex items-center gap-2 rounded-2xl bg-cream px-3 py-2 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span>{modelLoading ? 'Ìrànlọ́wọ́ ń bọ̀…' : 'Ròyìn ìdáhùn…'}</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t border-ink/10 bg-white px-4 py-3">
              {error ? (
                <p className="mb-2 text-xs text-red-600">{error}</p>
              ) : (
                <p className="mb-2 text-xs text-ink/50">Tip: {exampleHint}</p>
              )}
              <form className="flex items-end gap-2" onSubmit={(event) => void handleSubmit(event)}>
                <label htmlFor="assistant-message" className="sr-only">
                  Message Ìrànlọ́wọ́
                </label>
                <textarea
                  id="assistant-message"
                  rows={2}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Béèrè ohunkóhun…"
                  className="min-h-[56px] flex-1 resize-none rounded-2xl border border-ink/10 bg-cream/60 px-3 py-2 text-sm text-ink shadow-inner focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  aria-label="Message Ìrànlọ́wọ́"
                  disabled={modelLoading}
                />
                <button
                  type="submit"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={modelLoading || loadingReply || input.trim().length === 0}
                  aria-label="Send message"
                >
                  {loadingReply ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Send className="h-5 w-5" aria-hidden="true" />}
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => {
          setOpen((prev) => !prev);
          setError(null);
        }}
        className="fixed bottom-4 right-4 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-xl transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        aria-expanded={open}
        aria-controls="ilo-assistant"
        aria-label={open ? 'Close Ìrànlọ́wọ́ assistant' : 'Open Ìrànlọ́wọ́ assistant'}
      >
        {open ? <X className="h-7 w-7" aria-hidden="true" /> : <Bot className="h-7 w-7" aria-hidden="true" />}
      </button>
    </div>
  );
}
