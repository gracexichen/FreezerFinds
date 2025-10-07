import { Card, Button } from 'antd';
import { Skeleton } from '../ui/skeleton';
export function UserDetailsSkeleton() {
  return (
    <Card
      title={
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">User Details</div>
          <Button size="large" danger>
            Delete Account
          </Button>
        </div>
      }
      className="w-1/2">
      <div className="mb-4 flex flex-col">
        <p className="text-base font-medium">
          <Skeleton className="w-1/2 h-4" />
        </p>
        <p className="text-base font-medium">
          <Skeleton className="w-1/2 h-4" />
        </p>
      </div>
    </Card>
  );
}
