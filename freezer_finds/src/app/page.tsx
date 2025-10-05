import { SearchBar } from '@/components/home/search-bar';
import { Navbar } from '@/components/navbar/navbar';
import { HomeContent } from '@/components/home/home-content';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <Navbar />
        <HomeContent />
      </div>
    </main>
  );
}
