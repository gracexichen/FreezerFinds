import { Skeleton } from '@/components/ui/skeleton';
import { Card, Space } from 'antd';

export function DisplaySkeleton() {
  return (
    <Card title={<Skeleton className="h-4 w-[150px]" />}>
      <Space direction="vertical">
        <Skeleton className="w-full h-64 border border-gray-200 rounded-xl" />
        <Skeleton className="h-4 w-[250px] mb-2" />
        <Skeleton className="h-4 w-[250px]" />
      </Space>
    </Card>
  );
}
