import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faRetweet, faComment, faThumbsUp, faLightbulb, faComments } from '@fortawesome/free-solid-svg-icons';
import Modal from '../Modal';
import CommentForm from './CommentForm';
import '../../style/Modal.css';
import '../../style/Post.css';
import axios from '../../utils/axiosConfig';

const Post = ({ post, onClick }) => {
  const [isCommentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const openCommentModal = () => setCommentModalOpen(true);
  const closeCommentModal = () => setCommentModalOpen(false);

  const handleUpvoteComment = async (commentID) => {
    try {
      await axios.post(`/comments/${commentID}/upvote`);
      const updatedComments = post.Comments.map((comment) =>
        comment.commentID === commentID ? { ...comment, upvotes: (comment.upvotes || 0) + 1 } : comment
      );
      post.Comments = updatedComments;
    } catch (error) {
      console.error('Error upvoting comment:', error);
    }
  };

  const handleLikeComment = async (commentID) => {
    try {
      await axios.post(`/comments/${commentID}/like`);
      const updatedComments = post.Comments.map((comment) =>
        comment.commentID === commentID ? { ...comment, likes: (comment.likes || 0) + 1 } : comment
      );
      post.Comments = updatedComments;
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handlePostClick = () => {
    setSelectedPost(post);
    onClick(post);
  };

  return (
    <div>
      <div className="post" onClick={handlePostClick}>
        <div className="post-header">
          <span className="post-username">{post.User.username}</span>
          <span className="post-date">{new Date(post.createdAt).toLocaleString()}</span>
          <span className="post-type-icon">
            {post.postType === 'idea' ? <FontAwesomeIcon icon={faLightbulb} /> : <FontAwesomeIcon icon={faComments} />}
          </span>
        </div>
        <div className="post-content">
          {post.content}
        </div>
        <div className="post-footer">
          <button className="icon-button" onClick={openCommentModal}>
            <FontAwesomeIcon icon={faComment} /> {post.Comments.length}
          </button>
          <button className="icon-button">
            <FontAwesomeIcon icon={faHeart} /> {post.likeCount}
          </button>
          <button className="icon-button">
            <FontAwesomeIcon icon={faRetweet} /> {post.retweetCount}
          </button>
        </div>
        <div className="post-actions">
          <button onClick={openCommentModal}><FontAwesomeIcon icon={faComment} /></button>
          <button><FontAwesomeIcon icon={faHeart} /></button>
          <button><FontAwesomeIcon icon={faRetweet} /></button>
        </div>
      </div>
      <Modal isOpen={isCommentModalOpen} onClose={closeCommentModal}>
        <CommentForm onClose={closeCommentModal} />
      </Modal>
      {selectedPost && (
        <Modal isOpen={!!selectedPost} onClose={() => setSelectedPost(null)}>
          <div className="post-details">
            <h2>{selectedPost.User.username}</h2>
            <p>{selectedPost.content}</p>
            <div className="comments">
              {selectedPost.Comments.map((comment) => (
                <div key={comment.commentID} className="comment">
                  <span>{comment.content}</span>
                  <div className="comment-actions">
                    {selectedPost.postType === 'idea' ? (
                      <button onClick={() => handleLikeComment(comment.commentID)}><FontAwesomeIcon icon={faHeart} /> {comment.likes || 0}</button>
                    ) : (
                      <button onClick={() => handleUpvoteComment(comment.commentID)}><FontAwesomeIcon icon={faThumbsUp} /> {comment.upvotes || 0}</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Post;