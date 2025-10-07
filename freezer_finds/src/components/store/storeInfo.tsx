import { Store } from '@/types/store';
import { Skeleton } from '../ui/skeleton';
import Image from 'next/image';

interface StoreObjectProps {
  store: Store;
}

export function StoreInfoSkeleton() {
  return (
    <div className="w-full md:w-1/2 flex items-center justify-center p-6 border-2 rounded-xl m-2">
      <div className="flex flex-col items-center max-w-md">
        <Skeleton className="w-[160px] h-10 mb-4" />
        <Skeleton className="w-48 h-48 mb-4" />
        <Skeleton className="w-[200px] h-6" />
      </div>
    </div>
  );
}
export function StoreInfo({ store }: StoreObjectProps) {
  return (
    <div className="w-full md:w-1/2 flex items-center justify-center p-6 border-2 rounded-xl m-2">
      {store && (
        <div className="flex flex-col items-center max-w-md">
          <h1 className="text-3xl font-bold mb-4 text-center">{store.store_name}</h1>
          <Image
            src={store.picture_url}
            alt={store.store_name}
            className="w-48 h-48 object-cover rounded-sm mb-6 border"
            width={192}
            height={192}
          />
          <p className="text-sm text-gray-500 mt-2">
            {store.address}, {store.city}, {store.state}
          </p>
        </div>
      )}
    </div>
  );
}
