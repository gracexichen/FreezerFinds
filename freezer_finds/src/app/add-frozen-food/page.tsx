import { AddFrozenFood } from '@/components/add-frozen-food/add-frozen-food';

export default function AddFrozenFoodPage() {
  return (
    <>
      <div className="flex w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <AddFrozenFood />
        </div>
      </div>
    </>
  );
}
