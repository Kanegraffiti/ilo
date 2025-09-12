'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import AvatarPicker from '@/components/AvatarPicker';

export default function KidsPage() {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>Bola</Card>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Add Child
        </Button>
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <Input label="Nickname" />
          <AvatarPicker onSelect={() => {}} />
          <Button onClick={() => setOpen(false)}>Save</Button>
        </div>
      </Modal>
    </div>
  );
}
