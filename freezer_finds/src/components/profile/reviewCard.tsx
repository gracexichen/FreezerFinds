import { ReviewWithFrozenFood } from '@/types/reviews';
import { Card, Popconfirm } from 'antd';
import { DeleteOutlined, RightSquareOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { showErrorToast, showSuccessToast } from '../shared/toast';

type ReviewProps = {
  review: ReviewWithFrozenFood;
};

export function ReviewCard({ review }: Partial<ReviewProps>) {
  async function handleDelete() {
    try {
      if (!review) {
        return;
      }
      const response = await fetch(`/api/reviews/delete/${review.id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete review');
      }
      showSuccessToast('Review deleted successfully');
      window.location.reload();
    } catch (error) {
      showErrorToast('Unable to delete review');
    }
  }

  if (!review) return null;
  return (
    <Card
      className="w-80"
      title={
        <div className="flex justify-between items-center">
          <span className="font-semibold">{review.frozen_foods.food_name}</span>
          <Link href={`/frozen-food/${review.frozen_foods.id}`}>
            <RightSquareOutlined
              className="text-2xl text-blue-500 hover:text-blue-700 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            />
          </Link>
        </div>
      }>
      <div className="flex items-center justify-between mb-2">
        <span className="text-yellow-500">
          {'★'.repeat(review.rating)}
          {'☆'.repeat(5 - review.rating)}
        </span>
      </div>
      <div className="text-gray-700 mb-5">{review.review_text}</div>
      <div className="text-xs text-gray-400">{new Date(review.created_at).toLocaleString()}</div>
      <div className="flex justify-end mt-3">
        <Popconfirm title="Delete review?" okText="Yes" cancelText="No" onConfirm={handleDelete}>
          <DeleteOutlined className="text-red-500 hover:text-red-700 cursor-pointer text-2xl" />
        </Popconfirm>
      </div>
    </Card>
  );
}
