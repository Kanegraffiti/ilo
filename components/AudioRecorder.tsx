'use client';
import React, { useState, useRef } from 'react';

export default function AudioRecorder({ onRecorded }: { onRecorded: (blob: Blob) => void }) {
  const [recording, setRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const [url, setUrl] = useState<string>('');

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    mediaRecorder.current.ondataavailable = (e) => chunks.current.push(e.data);
    mediaRecorder.current.onstop = () => {
      const blob = new Blob(chunks.current, { type: 'audio/webm' });
      chunks.current = [];
      setUrl(URL.createObjectURL(blob));
      onRecorded(blob);
    };
    mediaRecorder.current.start();
    setRecording(true);
  };

  const stop = () => {
    mediaRecorder.current?.stop();
    setRecording(false);
  };

  return (
    <div className="space-y-2">
      {recording ? (
        <button className="px-4 py-2 bg-secondary text-paper" onClick={stop} aria-label="Stop recording">
          Stop
        </button>
      ) : (
        <button className="px-4 py-2 bg-primary text-paper" onClick={start} aria-label="Start recording">
          Record
        </button>
      )}
      {url && <audio controls src={url} className="w-full" />}
    </div>
  );
}
