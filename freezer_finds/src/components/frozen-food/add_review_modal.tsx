import React, { useState } from 'react';
import { Modal, Input, Rate, Button } from 'antd';
import { createClient } from '@/lib/supabase/client';

interface AddReviewModalProps {
  visible: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

const AddReviewModal: React.FC<AddReviewModalProps> = ({ visible, onSubmit, onCancel }) => {
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
    console.log('should be user id', userId);
    await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ review_text: text, rating: rating, user_id: userId })
    });

    // Close modal
    onSubmit();
    setText('');
    setRating(0);
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
