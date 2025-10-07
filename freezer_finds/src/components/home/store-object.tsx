import { Card, Space } from 'antd';
import { Store } from '@/types/store';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export function StoreObject({ store }: { store: Store }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/store/${store.id}`);
  };

  return (
    <Card title={store.store_name} style={{ width: 300 }} onClick={handleClick} hoverable>
      <Space direction="vertical">
        <Image
          src={store.picture_url}
          alt={store.store_name}
          className="w-full h-64 object-contain border border-gray-200 rounded-xl"
          width={300}
          height={256}
        />
        <p>
          <strong>Location:</strong> {store.address}, {store.city}, {store.state}
        </p>
      </Space>
    </Card>
  );
}
