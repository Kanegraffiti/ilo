'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { AvatarPicker } from '@/components/AvatarPicker';
import { Chip } from '@/components/ui/Chip';
import { useToast } from '@/components/ui/Toast';
import { usePageEnter } from '@/lib/anim';
import { motion } from 'framer-motion';

interface Kid {
  id: string;
  name: string;
  age: number;
  avatar: string;
  xp: number;
}

const STARTING_KIDS: Kid[] = [
  { id: 'k1', name: 'Adé', age: 7, avatar: 'sunny-tortoise', xp: 420 },
  { id: 'k2', name: 'Bisi', age: 9, avatar: 'forest-friend', xp: 360 },
];

export default function KidsPage() {
  const [kids, setKids] = useState<Kid[]>(STARTING_KIDS);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', age: 6, avatar: 'sunny-tortoise' });
  const { push } = useToast();
  const pageMotion = usePageEnter();

  const handleAddKid = () => {
    if (!form.name.trim()) {
      push({ title: 'Nickname needed', description: 'Ẹ jọ̀wọ́, add a friendly name.', tone: 'error' });
      return;
    }
    const newKid: Kid = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      age: form.age,
      avatar: form.avatar,
      xp: 0,
    };
    setKids((prev) => [...prev, newKid]);
    setModalOpen(false);
    setForm({ name: '', age: 6, avatar: 'sunny-tortoise' });
    push({ title: 'Child added', description: `Ẹ kú oríire! ${newKid.name} is ready to learn.`, tone: 'success' });
  };

  return (
    <motion.div {...pageMotion} className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Chip tone="accent" size="sm">
            Family crew
          </Chip>
          <h1 className="text-4xl font-serif">Kids</h1>
          <p className="text-lg text-ink/70">Create profiles so each child earns their own badges.</p>
        </div>
        <Button variant="secondary" size="md" onClick={() => setModalOpen(true)}>
          + Add child
        </Button>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {kids.map((kid) => (
          <Card key={kid.id} className="border border-ink/10 bg-white/85" bodyClassName="space-y-3">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
                {kid.name.charAt(0)}
              </span>
              <div>
                <p className="text-2xl font-serif">{kid.name}</p>
                <p className="text-lg text-ink/60">Age {kid.age}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Chip tone="secondary" size="sm">
                XP {kid.xp}
              </Chip>
              <Chip tone="accent" size="sm">
                Avatar saved
              </Chip>
            </div>
            <p className="text-ink/70">Keep streaks by practicing together for at least 5 minutes daily.</p>
          </Card>
        ))}
      </div>

      <Modal
        title="Add a child"
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setForm({ name: '', age: 6, avatar: 'sunny-tortoise' });
        }}
        actions={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddKid}>Save child</Button>
          </>
        }
      >
        <div className="space-y-6">
          <Input
            label="Nickname"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            helperText="Kids can choose a playful nickname."
          />
          <Select
            label="Age"
            value={form.age.toString()}
            onChange={(event) => setForm((prev) => ({ ...prev, age: Number(event.target.value) }))}
          >
            {Array.from({ length: 9 }, (_, index) => index + 4).map((age) => (
              <option key={age} value={age}>
                {age}
              </option>
            ))}
          </Select>
          <div className="space-y-3">
            <p className="text-base font-semibold text-ink">Pick an avatar</p>
            <AvatarPicker
              selectedId={form.avatar}
              onSelect={(avatar) => setForm((prev) => ({ ...prev, avatar }))}
            />
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
