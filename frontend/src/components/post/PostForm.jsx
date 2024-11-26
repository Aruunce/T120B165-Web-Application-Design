// PostForm.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb, faComments } from '@fortawesome/free-solid-svg-icons';
import axios from '../../utils/axiosConfig';

const PostForm = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('idea');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/posts', {
        content,
        postType
      });
      setContent('');
      onPostCreated(response.data);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="post-form-container">
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
            className={`type-button ${postType === 'discussion' ? 'active' : ''}`}
            onClick={() => setPostType('discussion')}
          >
            <FontAwesomeIcon icon={faComments} /> Discussion
          </button>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`Share your ${postType}...`}
          rows="4"
        />
        <button type="submit" className="submit-button">Post</button>
      </form>
    </div>
  );
};

export default PostForm;