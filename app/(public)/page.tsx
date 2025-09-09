import BrandLogo from '../../components/BrandLogo';
import InstallPrompt from '../../components/InstallPrompt';
import Link from 'next/link';

export default function Landing() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <BrandLogo size={80} />
      <h1 className="mt-4 text-3xl">Learn Yoruba with Ìlọ̀</h1>
      <p className="mt-2 max-w-md">Interactive lessons, quizzes, and cultural stories.</p>
      <Link href="/install" className="mt-4 px-4 py-2 bg-primary text-paper rounded">
        Get Started
      </Link>
      <div className="mt-4">
        <InstallPrompt />
      </div>
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="p-4 border rounded">Engaging Lessons</div>
        <div className="p-4 border rounded">Quizzes & Badges</div>
        <div className="p-4 border rounded">Culture & Stories</div>
      </div>
    </main>
  );
}
