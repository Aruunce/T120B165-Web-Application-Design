import React, { useState, useEffect, useRef  } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLightbulb, 
  faComments, 
  faComment, 
  faHeart, 
  faRetweet,
  faArrowLeft,
  faThumbsUp,
  faThumbsDown,
  faTrash,
  faEdit 
} from '@fortawesome/free-solid-svg-icons';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import Modal from '../Modal';
import axios from '../../utils/axiosConfig';

const Post = ({ post, onClick, openCommentModal, onLike, onRetweet }) => {

  const currentUserId = localStorage.getItem('userID');
  const userRole = localStorage.getItem('userRole');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editPostType, setEditPostType] = useState(post.postType);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullView, setIsFullView] = useState(false);
  const [commentActionStates, setCommentActionStates] = useState({});
  const [isLiked, setIsLiked] = useState(false);
  const [error, setError] = useState(null);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isRetweeted, setIsRetweeted] = useState(false);
  const [isRetweetLoading, setIsRetweetLoading] = useState(false)
  const commentsEndRef = useRef(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false);
  const [postData, setPostData] = useState({
    ...post,
    Comments: post?.Comments || [],
    likeCount: post?.likeCount || 0,
    retweetCount: post?.retweetCount || 0,
    User: post?.User || { username: 'Anonymous' }
  });

  const refreshPostData = async () => {
  try {
    const response = await axios.get(`/posts/${postData.postID}`);
    setPostData(response.data);
    setSelectedPost(response.data);
    return response.data;
  } catch (error) {
    console.error('Error refreshing post:', error);
    throw error;
  }
};

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      // Make API call
      await axios.put(`/posts/${postData.postID}`, {
        content: editContent,
        postType: editPostType
      });
  
      // Update states first
      setPostData({
        ...postData,
        content: editContent,
        postType: editPostType
      });
      
      // if (onEdit) {
      //   onEdit(postData.postID, {
      //     content: editContent,
      //     postType: editPostType
      //   });
      // }
  
      // Show success message briefly before closing
      setShowSuccess(true);
  
      // Close modal after short delay
      setTimeout(() => {
        console.log('Post updated successfully');
        setShowEditModal(false);
        setShowSuccess(false);
        setIsSubmitting(false);
      }, 1000); // Reduced delay to 1 second for better UX
  
    } catch (error) {
      console.error('Error updating post:', error);
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId, commentUserId) => {
    try {
      if (window.confirm('Are you sure you want to delete this comment?')) {
        await axios.delete(`/comments/${commentId}`);
        
        // Update local state to remove the deleted comment
        setPostData(prev => ({
          ...prev,
          Comments: prev.Comments.filter(c => c.commentID !== commentId)
        }));
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleDeletePost = async (e) => {
    e.stopPropagation(); // Prevent post opening when clicking delete
    
    try {
      if (window.confirm('Are you sure you want to delete this post?')) {
        await axios.delete(`/posts/${postData.postID}`);
        
        if (isFullView) {
          window.history.pushState({}, '', '/');
          window.location.reload(); // Refresh to show updated posts list
        } else {
          onClick && onClick({ type: 'delete', postId: postData.postID });
        }
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleCommentSubmit = async (commentContent) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post(`/posts/${postData.postID}/comments`, {
        content: commentContent,
        userID: localStorage.getItem('userID')
      });
  
      // Refresh post data to include the new comment
      await refreshPostData();
  
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchPostData = async () => {
      if (!post?.postID) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const userId = localStorage.getItem('userID');
        const response = await axios.get(`/posts/${post.postID}/like-retweet`, {
          params: { userId }
        });
        console.log(response.data);
        if (isMounted) {
          setIsLiked(response.data.isLiked);
          setIsRetweeted(response.data.isRetweeted);
          setPostData(prev => ({
            ...prev,
            likeCount: response.data.likeCount || 0,
            retweetCount: response.data.retweetCount || 0
          }));
        }
      } catch (error) {
        if (isMounted) {
          setError('Failed to load post data');
          console.error('Error loading post:', error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPostData();
    return () => { isMounted = false; };
  }, [post?.postID]);

  const closePostModal = () => {
    setSelectedPost(null);
    setIsFullView(false);
  };
  
  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const userId = localStorage.getItem('userID');
        const response = await axios.get(`/posts/${post.postID}/like-retweet`, {
          params: { userId }
        });
        
        setIsLiked(response.data.isLiked);
        setPostData(prev => ({
          ...prev,
          likeCount: response.data.likeCount,
          retweetCount: response.data.retweetCount
        }));
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };

    if (post?.postID) {
      checkLikeStatus();
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
    openCommentModal(postData, handleCommentSubmit);  // Pass the post data and the submit handler
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
      const userId = localStorage.getItem('userID');
      
      const response = await axios.post(`/comments/${commentId}/votes`, {
        userId,
        type: action
      });

      // Update comment votes in state with immediate feedback
      setPostData(prev => ({
        ...prev,
        Comments: prev.Comments.map(comment => {
          if (comment.commentID === commentId) {
            return {
              ...comment,
              upvotes: response.data.upvotes,
              downvotes: response.data.downvotes,
              userVote: response.data.userVote
            };
          }
          return comment;
        }).sort((a, b) => {
          const aVotes = (a.upvotes || 0) - (a.downvotes || 0);
          const bVotes = (b.upvotes || 0) - (b.downvotes || 0);
          return bVotes - aVotes;
        })
      }));

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

  const handleLike = async () => {
    if (isLikeLoading) return;
    
    try {
      setIsLikeLoading(true);
      const userId = localStorage.getItem('userID');
      
      if (isLiked) {
        await axios.delete(`/posts/${postData.postID}/like-retweet`, {
          params: { userId, type: 'like' }
        });
        setPostData(prev => ({
          ...prev,
          likeCount: Math.max(0, prev.likeCount - 1)
        }));
        setIsLiked(false);
      } else {
        await axios.post(`/posts/${postData.postID}/like-retweet`, {
          userId,
          type: 'like'
        });
        setPostData(prev => ({
          ...prev,
          likeCount: prev.likeCount + 1
        }));
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error handling like:', error);
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleRetweet = async () => {
    if (isRetweetLoading) return;
    
    try {
      setIsRetweetLoading(true);
      const userId = localStorage.getItem('userID');
      
      if (isRetweeted) {
        await axios.delete(`/posts/${postData.postID}/like-retweet`, {
          params: { userId, type: 'retweet' }
        });
        setPostData(prev => ({
          ...prev,
          retweetCount: Math.max(0, prev.retweetCount - 1)
        }));
        setIsRetweeted(false);
      } else {
        await axios.post(`/posts/${postData.postID}/like-retweet`, {
          userId,
          type: 'retweet'
        });
        setPostData(prev => ({
          ...prev,
          retweetCount: prev.retweetCount + 1
        }));
        setIsRetweeted(true);
      }
    } catch (error) {
      console.error('Error handling retweet:', error);
    } finally {
      setIsRetweetLoading(false);
    }
  };

  const currentUsername = localStorage.getItem('username');
  const isCurrentUserPost = postData?.User?.username === currentUsername;

  if (error) {
    return <div className="post error">{error}</div>;
  }

  if (isLoading) {
    return <div className="post loading">Loading...</div>;
  }

  const scrollToNewComment = () => {
    setTimeout(() => {
      commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100); // Small delay to ensure DOM update
  };
  
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
            {(currentUserId === postData.userID || userRole === 'admin') && (
              <div className="post-actions">
                <button 
                  className="edit-post-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEditModal(true);
                    setEditContent(postData.content);
                    setEditPostType(postData.postType);
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button 
                  className="delete-post-btn"
                  onClick={handleDeletePost}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            )}
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
           <div className="post-footer">
              <span 
                className="icon-wrapper comment" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  openCommentModal(postData); 
                }}
              >
                <FontAwesomeIcon icon={faComment} /> 
                {postData.Comments.length}
              </span>
              
              <span 
                className={`icon-wrapper like ${isLiked ? 'active' : ''}`}
                onClick={(e) => { 
                  e.stopPropagation(); 
                  handleLike(postData); 
                }}
              >
                <FontAwesomeIcon 
                  icon={faHeart} 
                  className={isLiked ? 'liked' : ''} 
                /> 
                {postData.likeCount}
              </span>
              
              <span 
                className={`icon-wrapper retweet ${isRetweeted ? 'active' : ''} ${isRetweetLoading ? 'loading' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRetweet();
                }}
              >
                <FontAwesomeIcon 
                  icon={faRetweet} 
                  className={isRetweeted ? 'retweeted' : ''} 
                />
                <span className="count">{postData.retweetCount}</span>
              </span>
            </div>
        </div>
          <div className="comments-section">
            <h3>Comments ({postData.Comments.length})</h3>
            <div className="comments">
              {postData?.Comments?.length > 0 ? (
                postData.Comments.map((comment, index) => (
                  <div 
                      key={comment.commentID || `temp-${Date.now()}`}
                      className="comment"
                      ref={index === 0 ? commentsEndRef : null}
                    >
                  <div className="comment-header">
                    <div className="comment-meta">
                    <span className="comment-username">
                      {comment.User?.username || 'Anonymous'}
                      </span>
                      <span className="comment-date">
                        {formatDate(comment.createdAt)}
                      </span>
                      {(currentUserId === comment.userID || userRole === 'admin') && (
                          <button 
                            className="delete-comment-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteComment(comment.commentID, comment.userID);
                            }}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        )}
                    </div>
                    </div>
                    <div className="comment-content">
                      {comment.content}
                    </div>
                    <div className="post-actions">
                      {postData.postType === 'idea' ? (
                       <span 
                        className={`icon-wrapper like ${isLiked ? 'active' : ''}`} 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                           
                        }}
                      >
                           <FontAwesomeIcon icon={faHeart} />
                           <span className="action-count">{postData.likeCount || 0}</span>
                        </span>
                      ) : (
                        <>
                          <span 
                            className={`icon-wrapper upvote ${comment.userVote === 'upvote' ? 'active' : ''} ${
                              commentActionStates[comment.commentID] ? 'loading' : ''
                            }`}
                            onClick={() => handleCommentAction(comment.commentID, 'upvote')}
                          >
                            <FontAwesomeIcon icon={faThumbsUp} /> 
                            <span className="vote-count">{comment.upvotes || 0}</span>
                          </span>

                          <span 
                            className={`icon-wrapper downvote ${comment.userVote === 'downvote' ? 'active' : ''} ${
                              commentActionStates[comment.commentID] ? 'loading' : ''
                            }`}
                            onClick={() => handleCommentAction(comment.commentID, 'downvote')}
                          >
                            <FontAwesomeIcon icon={faThumbsDown} /> 
                            <span className="vote-count">{comment.downvotes || 0}</span>
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
       {showEditModal && (
          <Modal isOpen={showEditModal} onClose={() => !showSuccess && setShowEditModal(false)}>
          <div className="post-form-container">
            <h2>Edit Post</h2>
            {showSuccess && (
              <div className="success-message">
                Post updated successfully!
              </div>
            )}
            <form onSubmit={(e) => {
              e.preventDefault();
              handleEditSubmit(e);
            }}>
              <div className="post-type-selector">
                <button
                  type="button"
                  className={`type-button ${editPostType === 'idea' ? 'active' : ''}`}
                  onClick={() => setEditPostType('idea')}
                >
                  <FontAwesomeIcon icon={faLightbulb} /> Idea
                </button>
                <button
                  type="button"
                  className={`type-button ${editPostType === 'forum' ? 'active' : ''}`}
                  onClick={() => setEditPostType('forum')}
                >
                  <FontAwesomeIcon icon={faComments} /> Discussion
                </button>
              </div>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder={`Share your ${editPostType}...`}
                className={`edit-post-textarea ${!editContent.trim() ? 'invalid' : ''}`}
                required
                minLength={10}
                maxLength={1000}
              />
              {!editContent.trim() && (
                <span className="form-validation">Content is required</span>
              )}
              {editContent.length < 10 && editContent.trim() && (
                <span className="form-validation">Content must be at least 10 characters</span>
              )}
              <div className="form-actions-centered">
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={!editContent.trim() || showSuccess || editContent.length < 10}
                >
                  {showSuccess ? 'Saved!' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  className="cancel-button" 
                  onClick={() => setShowEditModal(false)}
                  disabled={showSuccess}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Modal>
        )}
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
            {(currentUserId === postData.userID || userRole === 'admin') && (
                <div className="post-actions">
                  <button 
                    className="edit-post-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowEditModal(true);
                      setEditContent(postData.content);
                      setEditPostType(postData.postType);
                    }}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button 
                    className="delete-post-btn"
                    onClick={handleDeletePost}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              )}
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
              <span 
                className="icon-wrapper comment" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  openCommentModal(postData); 
                }}
              >
                <FontAwesomeIcon icon={faComment} /> 
                {postData.Comments.length}
              </span>
              
              <span 
                className={`icon-wrapper like ${isLiked ? 'active' : ''} ${isLikeLoading ? 'loading' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isLikeLoading) handleLike();
                }}
              >
                <FontAwesomeIcon 
                  icon={faHeart} 
                  className={isLiked ? 'liked' : ''} 
                />
                <span className="count">{postData.likeCount}</span>
              </span>
              
              <span 
                className={`icon-wrapper retweet ${isRetweeted ? 'active' : ''} ${isRetweetLoading ? 'loading' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRetweet();
                }}
              >
                <FontAwesomeIcon 
                  icon={faRetweet} 
                  className={isRetweeted ? 'retweeted' : ''} 
                />
                <span className="count">{postData.retweetCount}</span>
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
                              <span 
                                  className={`icon-wrapper upvote ${comment.userVote === 'upvote' ? 'active' : ''} ${
                                    commentActionStates[comment.commentID] ? 'loading' : ''
                                  }`}
                                  onClick={() => handleCommentAction(comment.commentID, 'upvote')}
                                >
                                  <FontAwesomeIcon icon={faThumbsUp} /> 
                                  <span className="vote-count">{comment.upvotes || 0}</span>
                                </span>

                                <span 
                                  className={`icon-wrapper downvote ${comment.userVote === 'downvote' ? 'active' : ''} ${
                                    commentActionStates[comment.commentID] ? 'loading' : ''
                                  }`}
                                  onClick={() => handleCommentAction(comment.commentID, 'downvote')}
                                >
                                  <FontAwesomeIcon icon={faThumbsDown} /> 
                                  <span className="vote-count">{comment.downvotes || 0}</span>
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
        {showEditModal && (
          <Modal isOpen={showEditModal} onClose={() => !showSuccess && setShowEditModal(false)}>
          <div className="post-form-container">
            <h2>Edit Post</h2>
            {showSuccess && (
              <div className="success-message">
                Post updated successfully!
              </div>
            )}
            <form onSubmit={(e) => {
              e.preventDefault();
              handleEditSubmit(e);
            }}>
              <div className="post-type-selector">
                <button
                  type="button"
                  className={`type-button ${editPostType === 'idea' ? 'active' : ''}`}
                  onClick={() => setEditPostType('idea')}
                >
                  <FontAwesomeIcon icon={faLightbulb} /> Idea
                </button>
                <button
                  type="button"
                  className={`type-button ${editPostType === 'forum' ? 'active' : ''}`}
                  onClick={() => setEditPostType('forum')}
                >
                  <FontAwesomeIcon icon={faComments} /> Discussion
                </button>
              </div>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder={`Share your ${editPostType}...`}
                className={`edit-post-textarea ${!editContent.trim() ? 'invalid' : ''}`}
                required
                minLength={10}
                maxLength={1000}
              />
              {!editContent.trim() && (
                <span className="form-validation">Content is required</span>
              )}
              {editContent.length < 10 && editContent.trim() && (
                <span className="form-validation">Content must be at least 10 characters</span>
              )}
              <div className="form-actions-centered">
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={!editContent.trim() || showSuccess || editContent.length < 10}
                >
                  {showSuccess ? 'Saved!' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  className="cancel-button" 
                  onClick={() => setShowEditModal(false)}
                  disabled={showSuccess}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Modal>
        )}
      </div>
    );
  };

export default Post;