'use client';
import React, { useState } from 'react';
import { Modal, Input, Rate, Button } from 'antd';
import { createClient } from '@/lib/supabase/client';
import { showErrorToast } from '../shared/toast';

interface AddReviewModalProps {
  frozenFoodId: string;
  visible: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  setRefresh: (value: boolean) => void;
  refresh: boolean;
}

const AddReviewModal: React.FC<AddReviewModalProps> = ({
  frozenFoodId,
  visible,
  onSubmit,
  onCancel,
  setRefresh,
  refresh
}) => {
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();

    if (error) {
      throw error;
    }

    // user id
    const userId = data?.claims?.sub;

    if (!userId) {
      showErrorToast('Please login or signup to submit a review');
      return;
    }

    // user id
    await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ review_text: text, rating: rating, frozen_food_id: frozenFoodId, user_id: userId })
    });

    // Close modal
    onSubmit();
    setText('');
    setRating(0);
    setRefresh(!refresh);
  };

  const handleCancel = () => {
    setText('');
    setRating(0);
    onCancel();
  };

  return (
    <Modal
      title="Add Review"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit} disabled={!text || rating === 0}>
          Submit
        </Button>
      ]}>
      <Input.TextArea
        rows={4}
        placeholder="Write your review..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <Rate value={rating} onChange={setRating} />
    </Modal>
  );
};

export default AddReviewModal;
