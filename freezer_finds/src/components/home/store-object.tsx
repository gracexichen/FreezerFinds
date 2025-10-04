import { Card, Space } from 'antd';
import { Store } from '@/types/store';

export function StoreObject({ store }: { store: Store }) {
  return (
    <Card title={store.store_name} style={{ width: 300 }}>
      <Space direction="vertical">
        <img src={store.picture_url} alt={store.store_name} style={{ maxWidth: '100%' }} />
        <p>
          <strong>Location:</strong> {store.address}, {store.city}, {store.state}
        </p>
      </Space>
    </Card>
  );
}
