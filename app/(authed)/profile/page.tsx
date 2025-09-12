import { Button } from '@/components/ui/button';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

export default function ProfilePage() {
  return (
    <div className="p-8 flex flex-col gap-4">
      <h1 className="text-2xl font-serif">Your Profile</h1>
      <p className="text-ink">Update your details.</p>
      <Button>Edit</Button>
    </div>
  );
}
