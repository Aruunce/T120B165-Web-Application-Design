import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLightbulb, 
  faComments, 
  faComment, 
  faHeart, 
  faRetweet,
  faArrowLeft,
  faThumbsUp,
  faThumbsDown
} from '@fortawesome/free-solid-svg-icons';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import Modal from '../Modal';

const Post = ({ post, onClick, openCommentModal, onLike, onRetweet }) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullView, setIsFullView] = useState(false);
  const [commentActionStates, setCommentActionStates] = useState({});
  const [postData, setPostData] = useState({
    ...post,
    Comments: post?.Comments || [],
    likeCount: post?.likeCount || 0,
    retweetCount: post?.retweetCount || 0,
    User: post?.User || { username: 'Anonymous' }
  });

  const closePostModal = () => {
    setSelectedPost(null);
    setIsFullView(false);
  };

  const handleCommentSubmitted = (newComment) => {
    setPostData(prevData => ({
      ...prevData,
      Comments: [newComment, ...prevData.Comments]
    }));
  };

  useEffect(() => {
    if (post) {
      setPostData({
        ...post,
        Comments: post.Comments?.map(comment => ({
          ...comment,
          User: comment.User || { username: 'Anonymous' },
          content: comment.content?.trim() || '', // Trim whitespace
          createdAt: comment.createdAt || new Date(),
          likes: comment.likes || 0,
          upvotes: comment.upvotes || 0,
          downvotes: comment.downvotes || 0
        })) || [],
        likeCount: post.likeCount || 0,
        retweetCount: post.retweetCount || 0,
        User: {
          username: post.User?.username || post.username || 'Anonymous'
        }
      });
      setIsLoading(false);
    }
  }, [post]);
  
  const handleBack = (e) => {
    e.preventDefault();
    e.stopPropagation(); 
    setIsFullView(false);
  };

  const handleCommentClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openCommentModal(postData, handleCommentSubmitted);
  };


  const handlePostClick = () => {
    if (!isLoading) {
      setIsFullView(true);
    }
  };

  const handleCommentAction = async (commentId, action) => {
    if (commentActionStates[commentId]) return;
    
    try {
      setCommentActionStates(prev => ({ ...prev, [commentId]: true }));
    } catch (error) {
      console.error(`Error handling comment ${action}:`, error);
    } finally {
      setCommentActionStates(prev => ({ ...prev, [commentId]: false }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
  };

  const currentUsername = localStorage.getItem('username');
  const isCurrentUserPost = postData?.User?.username === currentUsername;

  if (isLoading) {
    return <div className="post loading">Loading...</div>;
  }

  if (isFullView) {
    return (
      <div className="post-full-view">
       <div className="back-nav">
          <button className="back-button" onClick={handleBack}>
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Posts
          </button>
        </div>
        <div className="post detailed">
          <div className="post-header">
            <div className="username-container">
              <span className={`post-username ${isCurrentUserPost ? 'current-user' : ''}`}>
                {postData.User.username}
                {isCurrentUserPost && (
                  <svg className="crown-icon" width="16" height="16" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z"/>
                  </svg>
                )}
              </span>
            </div>
            <span className="post-date">
              {postData.createdAt ? new Date(postData.createdAt).toLocaleString() : 'Just now'}
            </span>
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
              {postData.content}
            </ReactMarkdown>
          </div>
          <div className="post-footer">
           <span className="icon-wrapper comment" onClick={handleCommentClick}>
              <FontAwesomeIcon icon={faComment} /> {postData.Comments.length}
            </span>
            <span className="icon-wrapper like" onClick={(e) => { e.stopPropagation(); onLike(postData); }}>
              <FontAwesomeIcon icon={faHeart} /> {postData.likeCount}
            </span>
            <span className="icon-wrapper retweet" onClick={(e) => { e.stopPropagation(); onRetweet(postData); }}>
              <FontAwesomeIcon icon={faRetweet} /> {postData.retweetCount}
            </span>
          </div>
          <div className="comments-section">
            <h3>Comments</h3>
            <div className="comments">
              {postData?.Comments?.length > 0 ? (
                postData.Comments.map((comment) => (
                  <div key={comment.commentID} className="comment">
                    <div className="comment-header">
                    <div className="comment-meta">
                    <span className="comment-username">
                      {comment.User?.username || 'Anonymous'}
                      </span>
                      <span className="comment-date">
                        Written: {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    </div>
                    <div className="comment-content">
                      {comment.content}
                    </div>
                    <div className="comment-actions">
                      {postData.postType === 'idea' ? (
                        <span 
                          className={`icon-wrapper like ${commentActionStates[comment.commentID] ? 'loading' : ''}`}
                          onClick={() => handleCommentAction(comment.commentID, 'like')}
                        >
                          <FontAwesomeIcon icon={faHeart} /> {comment.likes || 0}
                        </span>
                      ) : (
                        <>
                          <span 
                            className={`icon-wrapper upvote ${commentActionStates[comment.commentID] ? 'loading' : ''}`}
                            onClick={() => handleCommentAction(comment.commentID, 'upvote')}
                          >
                            <FontAwesomeIcon icon={faThumbsUp} /> {comment.upvotes || 0}
                          </span>
                          <span 
                            className={`icon-wrapper downvote ${commentActionStates[comment.commentID] ? 'loading' : ''}`}
                            onClick={() => handleCommentAction(comment.commentID, 'downvote')}
                          >
                            <FontAwesomeIcon icon={faThumbsDown} /> {comment.downvotes || 0}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-comments">No comments yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
      <div>
        <div className="post" onClick={handlePostClick}>
          <div className="post-header">
            <div className="username-container">
              <span className={`post-username ${isCurrentUserPost ? 'current-user' : ''}`}>
                {postData.User.username}
                {isCurrentUserPost && (
                  <svg className="crown-icon" width="16" height="16" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z"/>
                  </svg>
                )}
              </span>
            </div>
            <span className="post-date">
              {postData.createdAt ? new Date(postData.createdAt).toLocaleString() : 'Just now'}
            </span>
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
              {postData.content}
            </ReactMarkdown>
          </div>
          <div className="post-footer">
            <span className="icon-wrapper comment" onClick={(e) => { e.stopPropagation(); openCommentModal(postData); }}>
              <FontAwesomeIcon icon={faComment} /> {postData.Comments.length}
            </span>
            <span className="icon-wrapper like" onClick={(e) => { e.stopPropagation(); onLike(postData); }}>
              <FontAwesomeIcon icon={faHeart} /> {postData.likeCount}
            </span>
            <span className="icon-wrapper retweet" onClick={(e) => { e.stopPropagation(); onRetweet(postData); }}>
              <FontAwesomeIcon icon={faRetweet} /> {postData.retweetCount}
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