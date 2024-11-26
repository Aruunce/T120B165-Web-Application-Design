import React, { useState } from 'react';
import '../../style/CommentForm.css'; // Make sure to create this CSS file

const CommentForm = ({ onClose }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle comment submission logic here
    console.log('Comment submitted:', comment);
    onClose();
  };

  return (
    <div className="comment-form">
      <h2>Leave a Comment</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment here..."
          required
        />
        <div className="form-actions">
          <button type="submit">Submit</button>
          {/* <button type="button" onClick={onClose}>Cancel</button> */}
        </div>
      </form>
    </div>
  );
};

export default CommentForm;