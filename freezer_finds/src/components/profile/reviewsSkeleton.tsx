import { Card } from 'antd';
import { RightSquareOutlined, DeleteOutlined } from '@ant-design/icons';
import { Skeleton } from '../ui/skeleton';
export default function ReviewSkeleton() {
  return (
    <Card
      className="w-80"
      title={
        <div className="flex justify-between items-center">
          <span className="font-semibold">
            <Skeleton className="w-1/2 h-4" />
          </span>
          <RightSquareOutlined
            className="text-2xl text-blue-500 hover:text-blue-700 cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      }>
      <div className="flex items-center justify-between mb-2">
        <span className="text-yellow-500">
          <Skeleton className="w-20 h-4" />
        </span>
      </div>
      <div className="text-gray-700 mb-5">
        <Skeleton className="w-full h-4" />
      </div>
      <div className="text-xs text-gray-400">
        <Skeleton className="w-1/2 h-4" />
      </div>
      <div className="flex justify-end mt-3">
        <DeleteOutlined className="text-red-500 hover:text-red-700 cursor-pointer text-2xl" />
      </div>
    </Card>
  );
}
