import AppLogo from '@/public/app_logo.png';
import { AuthButton } from '@/components/authentication/auth-button';
import Link from 'next/link';
import { Button } from '../ui/button';

export function Navbar() {
  return (
    <nav className="w-full flex justify-center border-b border-b-gray-200 bg-white shadow-sm h-16 fixed top-0 left-0 z-50">
      <div className="w-full max-w-5xl flex justify-between items-center px-6">
        <Link href="/" className="flex items-center gap-3">
          <img src={AppLogo.src} alt="App Logo" className="h-10 w-10" />
          <span className="font-semibold text-lg text-gray-800">Freezer Finds</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/add-frozen-food">
            <Button size="sm" variant={'link'}>
              Add Frozen Food
            </Button>
          </Link>
          <Link href="/add-store">
            <Button size="sm" variant={'link'}>
              Add Store
            </Button>
          </Link>
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
