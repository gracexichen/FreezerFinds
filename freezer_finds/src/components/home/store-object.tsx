import { Card, Space } from 'antd';
import { Store } from '@/types/store';
import { useRouter } from 'next/navigation';

export function StoreObject({ store }: { store: Store }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/store/${store.id}`);
  };

  return (
    <Card title={store.store_name} style={{ width: 300 }} onClick={handleClick} hoverable>
      <Space direction="vertical">
        <img src={store.picture_url} alt={store.store_name} style={{ maxWidth: '100%' }} />
        <p>
          <strong>Location:</strong> {store.address}, {store.city}, {store.state}
        </p>
      </Space>
    </Card>
  );
}
