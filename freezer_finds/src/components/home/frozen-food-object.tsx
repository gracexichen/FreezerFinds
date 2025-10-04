import { Card, Space } from 'antd';
import { FrozenFoodExtended } from '@/types/frozen_foods';

export function FrozenFoodObject({ frozenFood }: { frozenFood: FrozenFoodExtended }) {
  return (
    <Card title="Frozen Food Information" style={{ width: 300 }}>
      <Space direction="vertical">
        <p>
          <strong>Name:</strong> {frozenFood.food_name}
        </p>
        <img src={frozenFood.picture_url} alt={frozenFood.food_name} />
        <p>
          <strong>Store:</strong> {frozenFood.stores?.store_name}
        </p>
      </Space>
    </Card>
  );
}
