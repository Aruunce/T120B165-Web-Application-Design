import React, { useState } from 'react';

const CommentForm = ({ onClose }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle comment submission logic here
    console.log('Submitting comment', { comment });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Comment</label>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default CommentForm;