import { Card, Space } from 'antd';
import { FrozenFoodExtended } from '@/types/frozen_foods';

export function FrozenFoodObject({ frozenFood }: { frozenFood: FrozenFoodExtended }) {
  return (
    <Card title={frozenFood.food_name} style={{ width: 300 }} hoverable>
      <Space direction="vertical">
        <img
          src={frozenFood.picture_url}
          alt={frozenFood.food_name}
          className="w-full h-64 object-contain border border-gray-200 rounded-xl"
        />
        <p>
          <strong>Ratings:</strong>{' '}
          {frozenFood.average_rating ? (
            <>
              {/* Rounded to nearest half star */}
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
            'No ratings yet!'
          )}
        </p>
        <p>
          <strong>Store:</strong> {frozenFood.stores?.store_name}
        </p>
      </Space>
    </Card>
  );
}
