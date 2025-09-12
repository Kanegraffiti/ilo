'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AvatarPicker from '@/components/AvatarPicker';
import { z } from 'zod';

const childSchema = z.object({ nickname: z.string().min(1), age: z.number().min(4).max(12) });

export default function KidsPage() {
  const [kids, setKids] = useState<any[]>([]);
  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState<number>(6);
  const add = () => {
    const parsed = childSchema.safeParse({ nickname, age });
    if (!parsed.success) return;
    setKids([...kids, { id: Date.now(), nickname, age }]);
    setNickname('');
  };
  return (
    <div className="p-8 flex flex-col gap-4">
      <h1 className="text-2xl font-serif">Kids</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
        className="flex flex-col gap-2 max-w-sm"
      >
        <input
          className="h-11 rounded-2xl border px-4"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <input
          className="h-11 rounded-2xl border px-4"
          type="number"
          min={4}
          max={12}
          value={age}
          onChange={(e) => setAge(parseInt(e.target.value))}
        />
        <AvatarPicker onSelect={() => {}} />
        <Button type="submit">Add Child</Button>
      </form>
      <div className="grid gap-2">
        {kids.map((k) => (
          <Card key={k.id} className="flex items-center justify-between p-4">
            <span>{k.nickname} ({k.age})</span>
            <Button size="sm" variant="secondary" onClick={() => setKids(kids.filter(x => x.id !== k.id))}>Delete</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
