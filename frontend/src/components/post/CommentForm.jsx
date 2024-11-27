import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosConfig';
import '../../style/CommentForm.css';

const CommentForm = ({ onClose, postID, onCommentSubmitted }) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    console.log('PostID received:', postID);
  }, [postID]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Comment cannot be empty');
      return;
    }
  
    setIsSubmitting(true);
    setError('');
  
    try {
      const response = await axios.post(`/posts/${postID}/comments`, {
        content: comment.trim(),
        userID: parseInt(localStorage.getItem('userID'))
      });
  
      const newComment = {
        ...response.data.comment,
        postID,
        User: {
          username: localStorage.getItem('username')
        }
      };
  
      setSuccess(true);
      setComment(''); // Clear comment input
  
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        if (onCommentSubmitted) {
          onCommentSubmitted(newComment);
        }
      }, 3000);
  
    } catch (error) {
      console.error('Error posting comment:', error);
      setError(error.response?.data?.error || 'Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comment-form">
      <h2>Add a Comment</h2>
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="success-message" role="alert">
          {success}
        </div>
      )}
      <form onSubmit={handleSubmit} method="POST">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What are your thoughts?"
          required
          disabled={isSubmitting}
          autoFocus
          minLength={1}
          maxLength={1000}
        />
        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting || !comment.trim()}
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};


export default CommentForm;