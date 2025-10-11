"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

export type CharacterProfile = {
  name: string;
  image: string;
  tagline: string;
  catchphrase: string;
};

interface CharacterGalleryProps {
  characters: CharacterProfile[];
}

function CharacterCard({ character, index }: { character: CharacterProfile; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.05 }}
      className="group relative flex flex-col items-center rounded-2xl bg-surface-2/80 p-4 text-center shadow-lg shadow-black/5 ring-1 ring-black/5 transition-all duration-200 ease-out hover:scale-105 hover:shadow-xl hover:ring-black/10 focus-within:scale-105"
    >
      <div className="pointer-events-none absolute -top-3 left-1/2 hidden w-max -translate-x-1/2 -translate-y-full flex-col items-center gap-1 text-sm font-semibold text-white opacity-0 transition-opacity duration-200 group-hover:flex group-hover:opacity-100">
        <span
          className="relative rounded-full bg-primary px-3 py-1 shadow-md shadow-black/20"
          role="presentation"
          aria-hidden="true"
        >
          “{character.catchphrase}”
        </span>
        <span className="-mt-1 h-2 w-3 rotate-180 rounded-b-full bg-primary" aria-hidden="true" />
      </div>
      <div className="flex h-40 w-full items-center justify-center overflow-hidden rounded-xl bg-surface-1/70">
        <Image
          src={character.image}
          alt={`Illustrated Yorùbá character ${character.name}`}
          width={320}
          height={320}
          priority={index < 2}
          sizes="(min-width: 1280px) 240px, (min-width: 1024px) 220px, (min-width: 640px) 200px, 45vw"
          className="h-full w-full object-contain"
        />
      </div>
      <h2 className="mt-4 text-xl font-semibold text-[var(--on-surface-2)]">{character.name}</h2>
      <p className="text-sm text-[var(--on-surface-2)]/80">{character.tagline}</p>
      <span className="sr-only">{character.catchphrase}</span>
    </motion.article>
  );
}

export function CharacterGallery({ characters }: CharacterGalleryProps) {
  return (
    <section aria-labelledby="character-gallery-heading" className="space-y-8">
      <div className="space-y-2 text-center">
        <h1 id="character-gallery-heading" className="text-4xl font-serif">
          Ìlọ̀ Characters
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-[var(--on-surface-1)]/75">
          Meet the cheerful Yorùbá mascots guiding little learners through songs, stories, and playful lessons.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {characters.map((character, index) => (
          <CharacterCard key={character.name} character={character} index={index} />
        ))}
      </div>
    </section>
  );
}

export default CharacterGallery;
