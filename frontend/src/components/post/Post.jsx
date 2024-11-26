// FILE: frontend/src/components/post/Post.jsx

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faRetweet, faComment, faThumbsUp, faThumbsDown, faLightbulb, faComments } from '@fortawesome/free-solid-svg-icons';
import Modal from '../Modal';
import CommentForm from './CommentForm';
import '../../style/Modal.css';
import '../../style/Post.css';
import axios from '../../utils/axiosConfig';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Post = ({ post, onClick, openCommentModal, onLike, onRetweet }) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [postData, setPostData] = useState(post);

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

  const handleDownvoteComment = async (commentID) => {
    try {
      await axios.post(`/comments/${commentID}/downvote`);
      const updatedComments = post.Comments.map((comment) =>
        comment.commentID === commentID ? { ...comment, downvotes: (comment.downvotes || 0) + 1 } : comment
      );
      post.Comments = updatedComments;a
    } catch (error) {
      console.error('Error downvoting comment:', error);
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

  const handleRetweetComment = async (commentID) => {
    try {
      await axios.post(`/comments/${commentID}/retweet`);
      const updatedComments = post.Comments.map((comment) =>
        comment.commentID === commentID ? { ...comment, retweets: (comment.retweets || 0) + 1 } : comment
      );
      post.Comments = updatedComments;
    } catch (error) {
      console.error('Error retweeting comment:', error);
    }
  };

  const handlePostClick = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/posts/${postData.postID}/details`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSelectedPost(response.data);
      setPostData(response.data); // Update local post data with fresh data
    } catch (error) {
      console.error('Error fetching post details:', error);
    }
  };

  const closePostModal = () => {
    setSelectedPost(null);
  };
  return (
    <div>
      <div className="post" onClick={handlePostClick}>
        <div className="post-header">
          <span className="post-username">{postData.User.username}</span>
          <span className="post-date">{new Date(postData.createdAt).toLocaleString()}</span>
          <span className="post-type-icon">
            {postData.postType === 'idea' ? 
              <FontAwesomeIcon icon={faLightbulb} /> : 
              <FontAwesomeIcon icon={faComments} />}
          </span>
        </div>
        <div className="post-content">
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={tomorrow}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
        <div className="post-footer">
          <span className="icon-wrapper comment" onClick={(e) => { e.stopPropagation(); openCommentModal(e); }}>
            <FontAwesomeIcon icon={faComment} /> {post.Comments.length}
          </span>
          <span className="icon-wrapper like" onClick={(e) => { e.stopPropagation(); onLike(); }}>
            <FontAwesomeIcon icon={faHeart} /> {post.likeCount || 0}
          </span>
          <span className="icon-wrapper retweet" onClick={(e) => { e.stopPropagation(); onRetweet(); }}>
            <FontAwesomeIcon icon={faRetweet} /> {post.retweetCount || 0}
          </span>
        </div>
      </div>
      {selectedPost && (
         <Modal isOpen={!!selectedPost} onClose={closePostModal}>
         <div className="post-details">
           <div className="post">
             <div className="post-header">
               <span className="post-username">{selectedPost.User.username}</span>
               <span className="post-date">{new Date(selectedPost.createdAt).toLocaleString()}</span>
               <span className="post-type-icon">
                 {selectedPost.postType === 'idea' ? 
                   <FontAwesomeIcon icon={faLightbulb} /> : 
                   <FontAwesomeIcon icon={faComments} />}
               </span>
             </div>
             <div className="post-content">
             <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={tomorrow}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {selectedPost.content}
              </ReactMarkdown>
             </div>
             <div className="post-footer">
               <span className="icon-wrapper comment" onClick={(e) => { e.stopPropagation(); openCommentModal(e); }}>
                 <FontAwesomeIcon icon={faComment} /> {selectedPost.Comments.length}
               </span>
               <span className="icon-wrapper like">
                 <FontAwesomeIcon icon={faHeart} /> {selectedPost.likeCount || 0}
               </span>
               <span className="icon-wrapper retweet">
                 <FontAwesomeIcon icon={faRetweet} /> {selectedPost.retweetCount || 0}
               </span>
             </div>
           </div>
           <div className="comments">
                {selectedPost.Comments && selectedPost.Comments.length > 0 ? (
                  selectedPost.Comments.map((comment) => (
                    <div key={comment.commentID} className="comment">
                      <span>{comment.content}</span>
                      <div className="comment-actions">
                        {selectedPost.postType === 'idea' ? (
                          <span className="icon-wrapper like" onClick={() => handleLikeComment(comment.commentID)}>
                            <FontAwesomeIcon icon={faHeart} /> {comment.likes || 0}
                          </span>
                        ) : (
                          <>
                            <span className="icon-wrapper upvote" onClick={() => handleUpvoteComment(comment.commentID)}>
                              <FontAwesomeIcon icon={faThumbsUp} /> {comment.upvotes || 0}
                            </span>
                            <span className="icon-wrapper downvote" onClick={() => handleDownvoteComment(comment.commentID)}>
                              <FontAwesomeIcon icon={faThumbsDown} /> {comment.downvotes || 0}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No comments yet.</p>
                )}
              </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Post;