import { Card } from '@/components/ui/Card';
import AvatarPicker from '@/components/AvatarPicker';

export default function ProfilePage() {
  return (
    <div className="p-4 space-y-4">
      <Card>
        <h1 className="text-xl font-bold mb-2">Profile</h1>
        <p>Ada</p>
      </Card>
      <AvatarPicker />
    </div>
  );
}
