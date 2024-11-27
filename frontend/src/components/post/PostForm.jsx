// PostForm.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb, faComments } from '@fortawesome/free-solid-svg-icons';
import axios from '../../utils/axiosConfig';
import '../../style/Post.css';

const PostForm = ({ onSubmit, onClose }) => {
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('idea');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const validateForm = () => {
    const newErrors = {};
    
    // Content validation
    if (!content.trim()) {
      newErrors.content = 'Content is required';
    } else if (content.length < 10) {
      newErrors.content = 'Content must be at least 10 characters';
    } else if (content.length > 1000) {
      newErrors.content = 'Content must not exceed 1000 characters';
    }
  
    // Post type validation
    if (!['idea', 'forum'].includes(postType)) {
      newErrors.postType = 'Invalid post type';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const userID = localStorage.getItem('userID');
    if (!userID) {
      setApiError('User session expired. Please login again.');
      return;
    }

    setIsSubmitting(true);
    setApiError('');
  
    try {
      const postData = {
        content,
        postType,
        userID: parseInt(userID)
      };
      
      await onSubmit(postData);
      setSuccess(true);
      setIsSubmitting(false);
      
      // Wait to show success message before closing
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                          'Failed to create post. Please try again.';
      setApiError(errorMessage);
      setIsSubmitting(false);
      // Don't close form on error
    }
  };

  return (
    <div className="post-form-container">
      <h2>Create New Post</h2>
      {success && (
        <div className="success-message">
          Post created successfully!
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="post-type-selector">
          <button
            type="button"
            className={`type-button ${postType === 'idea' ? 'active' : ''}`}
            onClick={() => setPostType('idea')}
          >
            <FontAwesomeIcon icon={faLightbulb} /> Idea
          </button>
          <button
            type="button"
            className={`type-button ${postType === 'forum' ? 'active' : ''}`}
            onClick={() => setPostType('forum')}
          >
            <FontAwesomeIcon icon={faComments} /> Discussion
          </button>
        </div>
        {apiError && (
          <div className="error-message">
            {apiError}
          </div>
        )}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`Share your ${postType}...`}
          className={errors.content ? 'invalid' : ''}
          rows="4"
          required
        />
        {errors.content && (
          <span className="form-validation">{errors.content}</span>
        )}
        <div className="form-actions-centered">
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
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

export default PostForm;