import { FrozenFoodExtended } from '@/types/frozen_foods';
import { Skeleton } from '../ui/skeleton';
import Image from 'next/image';

export function FrozenFoodInfoSkeleton() {
  return (
    <div className="w-full md:w-1/2 flex items-center justify-center p-6 border-2 rounded-xl m-2">
      <div className="flex flex-col items-center max-w-md">
        <Skeleton className="w-[130px] h-12 mb-4" />
        <Skeleton className="w-48 h-48" />
        <Skeleton className="w-[150px] h-6 mt-4" />
        <Skeleton className="w-[80px] h-4 mt-2" />
      </div>
    </div>
  );
}
export function FrozenFoodInfo({ frozenFood }: { frozenFood: FrozenFoodExtended }) {
  return (
    <div className="w-full md:w-1/2 flex items-center justify-center p-6 m-2">
      {frozenFood && (
        <div className="flex flex-col items-center max-w-md">
          <h1 className="text-3xl font-bold mb-4 text-center">{frozenFood.food_name}</h1>
          <Image
            src={frozenFood.picture_url}
            alt={frozenFood.stores?.store_name || 'Frozen Food Image'}
            className="w-48 h-48 object-cover rounded-sm mb-6 border"
            width={192}
            height={192}
          />
          <div>
            <span style={{ color: '#fadb14', marginRight: 8 }}>
              {Array.from({ length: 5 }).map((_, i) => {
                const rating = frozenFood.average_rating ?? 0;
                if (rating >= i + 1) return '★';
                if (rating >= i + 0.5) return '⯨';
                return '☆';
              })}
            </span>
            {frozenFood.average_rating?.toFixed(2)}
          </div>
          <p className="text-sm text-gray-500 mt-2">{frozenFood.stores?.store_name}</p>
        </div>
      )}
    </div>
  );
}
