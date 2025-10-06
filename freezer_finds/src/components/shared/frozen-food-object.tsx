import { Card, Space } from 'antd';
import { FrozenFoodExtended } from '@/types/frozen_foods';
import { useRouter } from 'next/navigation';

export function FrozenFoodObject({ frozenFood }: { frozenFood: FrozenFoodExtended }) {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/frozen-food/${frozenFood.id}`);
  };
  return (
    <Card title={frozenFood.food_name} style={{ width: 300 }} onClick={handleClick} hoverable>
      <Space direction="vertical">
        <img src={frozenFood.picture_url} alt={frozenFood.food_name} />
        <p>
          <strong>Ratings:</strong>{' '}
          {frozenFood.average_rating ? (
            <>
              <span style={{ color: '#fadb14', marginRight: 8 }}>
                {Array.from({ length: 5 }).map((_, i) => {
                  const rating = frozenFood.average_rating ?? 0;
                  if (rating >= i + 1) return '★';
                  if (rating >= i + 0.5) return '⯨';
                  return '☆';
                })}
              </span>
              {frozenFood.average_rating.toFixed(2)}
            </>
          ) : (
            'No ratings yet'
          )}
        </p>
        <p>
          <strong>Store:</strong> {frozenFood.stores?.store_name}
        </p>
      </Space>
    </Card>
  );
}
