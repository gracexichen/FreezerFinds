import AppLogo from '@/public/app_logo.png';
import { AuthButton } from '@/components/authentication/auth-button';
import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <Link href="/" className="flex items-center space-x-2">
          <img src={AppLogo.src} alt="App Logo" className="h-10 w-10" />
          <p>Freezer Finds</p>
        </Link>
        <AuthButton />
      </div>
    </nav>
  );
}
