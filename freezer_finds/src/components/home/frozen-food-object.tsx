import { Card, Space } from 'antd';
import { FrozenFoodExtended } from '@/types/frozen_foods';

export function FrozenFoodObject({ frozenFood }: { frozenFood: FrozenFoodExtended }) {
  return (
    <Card title={frozenFood.food_name} style={{ width: 300 }}>
      <Space direction="vertical">
        <img src={frozenFood.picture_url} alt={frozenFood.food_name} />
        <p>
          <strong>Store:</strong> {frozenFood.stores?.store_name}
        </p>
        <p>
          <strong>Average Rating:</strong> {frozenFood.average_rating?.toFixed(2) || 'No ratings yet'}
        </p>
      </Space>
    </Card>
  );
}
