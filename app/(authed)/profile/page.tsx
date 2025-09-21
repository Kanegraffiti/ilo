'use client';

import Icon from '@/components/icons/Icon';
import { AvatarPicker } from '@/components/AvatarPicker';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';
import { usePageEnter } from '@/lib/anim';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ProfilePage() {
  const [profile, setProfile] = useState({ name: 'Mama Adé', country: 'NG', avatar: 'sunny-tortoise' });
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(profile);
  const { push } = useToast();
  const pageMotion = usePageEnter();

  const handleSave = () => {
    setProfile(form);
    setModalOpen(false);
    push({ title: 'Profile updated', description: 'Ẹ ṣe! Your details are fresh and tidy.', tone: 'success' });
  };

  return (
    <motion.div {...pageMotion} className="space-y-8">
      <header className="space-y-3">
        <Chip tone="accent" size="sm">
          Guardian profile
        </Chip>
        <h1 className="text-4xl font-serif">Welcome back, {profile.name}</h1>
        <p className="text-lg text-ink/70">Track streaks and update your family details anytime.</p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="border border-ink/10 bg-white/85" bodyClassName="space-y-4">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/15 text-2xl">
              {profile.name.charAt(0)}
            </span>
            <div>
              <p className="text-2xl font-serif">{profile.name}</p>
              <p className="text-lg text-ink/60">Country: {profile.country === 'NG' ? 'Nigeria' : 'Global'}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Chip tone="secondary" size="sm">
              Preferred avatar
            </Chip>
            <Chip tone="accent" size="sm">
              Learning buddy ready
            </Chip>
          </div>
          <Button variant="primary" size="md" onClick={() => setModalOpen(true)}>
            Edit profile
          </Button>
        </Card>
        <Card className="border border-ink/10 bg-white/85" bodyClassName="flex flex-col items-center gap-4">
          <ProgressRing value={68} label="XP" />
          <p className="text-lg text-ink/70">Total XP: 1,250</p>
          <Chip tone="accent" size="md">
            <Icon name="star" size={16} color="var(--on-accent)" className="shrink-0" aria-hidden />
            12-day streak
          </Chip>
        </Card>
      </section>

      <Modal
        title="Edit guardian profile"
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setForm(profile);
        }}
        actions={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save changes</Button>
          </>
        }
      >
        <div className="space-y-6">
          <Input
            label="Display name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          />
          <Select
            label="Country"
            value={form.country}
            onChange={(event) => setForm((prev) => ({ ...prev, country: event.target.value }))}
          >
            <option value="NG">Nigeria</option>
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
            <option value="CA">Canada</option>
          </Select>
          <div className="space-y-3">
            <p className="text-base font-semibold text-ink">Choose avatar</p>
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
