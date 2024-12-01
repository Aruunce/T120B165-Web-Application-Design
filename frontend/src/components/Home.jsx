// FILE: frontend/src/components/Home.jsx

import React, { useState, useEffect } from 'react';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Post from './post/Post';
import Modal from './Modal';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import CommentForm from './post/CommentForm';
import axios from '../utils/axiosConfig';
import PostForm from './post/PostForm';

const Home = () => {
  const [userRole, setUserRole] = useState('guest');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedPostForComment, setSelectedPostForComment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isFullView, setIsFullView] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const handleOpenCommentModal = (post) => {
    setSelectedPostForComment(post);
    setModalType('comment');
  };

  const fetchPostById = async (postId) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // Make request with authorization header
      const response = await axios.get(`/posts/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.data) {
        throw new Error('Post not found');
      }
  
      return response.data;
      
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Post not found');
      }
  
      console.error('Error fetching post:', error);
      throw error;
    }
  };

  const updatePost = (updatedPost) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.postID === updatedPost.postID ? updatedPost : post
      )
    );
  };

  const handleLikePost = async (postId) => {
    try {
      await axios.post(`/posts/${postId}/like-retweet`, {
        userId: localStorage.getItem('userID'),
        type: 'like'
      });
      
      // Get fresh post data
      const updatedPost = await fetchPostById(postId);
      updatePost(updatedPost);

    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleUrlParams = async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const postId = params.get('postId');
      
      const token = localStorage.getItem('token');
      const savedRole = localStorage.getItem('userRole');
  
      // Set initial role
      if (token && savedRole) {
        setUserRole(savedRole);
      } else {
        setUserRole('guest');
        return; // Return if guest
      }
  
      // First fetch all posts
      await fetchRecentPosts();
  
      // If there's a postId, show it in full view
      if (postId) {
        try {
          // Find post in already fetched posts or fetch it separately
          let fullPost = posts.find(p => p.postID === parseInt(postId));
          
          if (!fullPost) {
            fullPost = await fetchPostById(parseInt(postId));
            // Add to posts if not exists
            setPosts(prevPosts => [fullPost, ...prevPosts]);
          }
  
          // Set full view mode states
          setSelectedPostId(parseInt(postId));
          setSelectedPost(fullPost);
          setIsFullView(true);
        } catch (error) {
          console.error('Error loading specific post:', error);
          if (error.response?.status === 401) {
            setUserRole('guest');
          }
        }
      }
    } catch (error) {
      console.error('Error in handleUrlParams:', error);
    }
  };

  // useEffect(() => {
  //   handleUrlParams();
  // }, []);

  // Add SuccessMessage component at the top
  const SuccessMessage = () => (
    <div className="success-message">
      Comment posted successfully!
      <style jsx>{`
        .success-message {
          position: fixed;
          top: 20px;
          right: 20px;
          background-color: #4CAF50;
          color: white;
          padding: 15px 30px;
          border-radius: 4px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          animation: slideIn 0.3s ease-out;
          z-index: 1000;
        }
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );

  useEffect(() => {
    let isMounted = true;
  
    const handleInitialLoad = async () => {
      try {
        const token = localStorage.getItem('token');
        const savedRole = localStorage.getItem('userRole');
        const params = new URLSearchParams(window.location.search);
        const postId = params.get('postId');
  
        if (isMounted) {
          if (token && savedRole) {
            setUserRole(savedRole);
          } else {
            setUserRole('guest');
          }
        }
  
        await fetchRecentPosts();

        // Use the same open post handler for URL params
        if (postId && isMounted) {
          await handleOpenPost(parseInt(postId));
        }
      } catch (error) {
        console.error('Error in handleInitialLoad:', error);
        if (isMounted && error.response?.status === 401) {
          setUserRole('guest');
        }
      }
    };
  
    handleInitialLoad();
  
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenPost = async (postId) => {
    try {
      // Fetch the full post details
      const fullPost = await fetchPostById(postId);
      
      // Set states for full view mode
      setSelectedPostId(postId);
      setSelectedPost(fullPost);
      setIsFullView(true);
      
      // Update URL without reloading the page
      window.history.pushState({}, '', `?postId=${postId}`);
      
      // Update posts state to include full post data
      setPosts(prevPosts => 
        prevPosts.map(p => 
          p.postID === postId ? fullPost : p
        )
      );
    } catch (error) {
      console.error('Error opening post:', error);
    }
  };

  const handlePostClick = (post) => {
    handleOpenPost(post.postID);
  };

  const handleBack = async () => {
    setSelectedPostId(null);
    // Remove postId from URL
    window.history.pushState({}, '', '/');
    // Refresh posts list
    await fetchRecentPosts();
  };

  const fetchRecentPosts = async () => {
    try {
      const response = await axios.get('/posts/recent');
      setPosts(response.data.map(post => ({
        ...post,
        Comments: post.Comments || [],
        User: post.User || { username: 'Anonymous' }
      })));
    } catch (error) {
      console.error('Error fetching recent posts:', error);
    }
  };

  const openModal = (type) => {
    setModalType(type);
  };
  
  const closeModal = () => {
    setModalType(null);
    setShowPostForm(false);
    setSelectedPostForComment(null);
  };


  const handleLogin = (role, username) => {
    setUserRole(role);
    setUsername(username);
    closeModal();
    fetchRecentPosts();
  };

  const handleRegisterClick = () => {
    closeModal();
    openModal('register');
  };

  const handleRetweetPost = async (postId) => {
    try {
      await axios.post(`/posts/${postId}/like-retweet`, {
        userId: localStorage.getItem('userID'),
        type: 'retweet'
      });
      
      // Get fresh post data
      const updatedPost = await fetchPostById(postId);
      updatePost(updatedPost);
  
    } catch (error) {
      console.error('Error retweeting post:', error);
    }
  };

  const handleCreatePost = async (postData) => {
    try {
      const response = await axios.post('/posts', postData);
      const newPost = {
        ...response.data.post,
        User: { username: username || localStorage.getItem('username') },
        Comments: [],
        likeCount: 0,
        retweetCount: 0,
      };
  
      // Add new post to state and set as selected
      setPosts(prevPosts => [newPost, ...prevPosts]);
      setSelectedPost(newPost);
      setSelectedPostId(newPost.postID);
      setIsFullView(true);
      
      // Update URL 
      window.history.pushState({}, '', `?postId=${newPost.postID}`);
      
      // Close modal and show success
      closeModal();
      setShowPostForm(false);
      setModalType(null);
      setShowSuccess(true);
      
      // Get fresh post data to ensure we have all fields
      const freshPost = await fetchPostById(newPost.postID);
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.postID === newPost.postID ? freshPost : post
        )
      );
  
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
  
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };

  const handlePostAction = async ({ type, postId, data }) => {
    if (type === 'delete') {
      setPosts(prevPosts => prevPosts.filter(post => post.postID !== postId));
    } else if (type === 'edit') {
      // Update the post in state after edit
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.postID === postId ? { ...post, ...data } : post
        )
      );
    }
  };

  const handleCommentSubmitted = async (newComment) => {
    try {
      setIsSubmitting(true);
      
      // Submit comment
      const response = await axios.post(`/posts/${selectedPostForComment.postID}/comments`, {
        content: newComment.content,
        userID: localStorage.getItem('userID')
      });
  
      // Store current post ID
      const currentPostId = selectedPostForComment.postID;
      
      // Get fresh post data with updated comments
      const updatedPost = await fetchPostById(currentPostId);
      
      // Update posts state
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.postID === currentPostId ? updatedPost : post
        )
      );
  
      // Update URL to maintain state after refresh
      window.history.pushState({}, '', `?postId=${currentPostId}`);
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
  
      // Close modal and refresh data
      closeModal();
  
    } catch (error) {
      console.error('Error handling comment:', error);
      if (error.response?.status === 401) {
        setUserRole('guest');
      } else {
        alert('Failed to post comment. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
      setSelectedPostForComment(null);
    }
  };

  return (
    <div id="root">
      {showSuccess && <SuccessMessage />}
      <Header 
        openLogin={() => openModal('login')}
        openRegister={() => openModal('register')}
        userRole={userRole} 
        onLogout={() => {
          localStorage.clear();
          setUserRole('guest');
          setUsername('');
        }}
        username={username} 
      />
      <main className="content">
        {userRole === 'guest' ? (
          <h1>Welcome to Postoria</h1>
        ) : (
          <div>
            {!isFullView && (
              <button className="create-post-btn" 
              onClick={() => {
                  setShowPostForm(true);
                  setModalType('createPost');
                }}
              >
                Create New Post
              </button>
            )}
            <div className="posts">
            {selectedPostId ? (
              <Post 
                post={posts.find(p => p.postID === selectedPostId)}
                isFullView={true}
                openCommentModal={handleOpenCommentModal}
                onLike={handleLikePost}
                onRetweet={handleRetweetPost}
                onBack={() => {
                  setSelectedPostId(null);
                  setIsFullView(false);
                  // Update URL to remove postId
                  window.history.pushState({}, '', '/');
                }}
                selectedPost={selectedPost}
                onClick={handlePostAction}
                onEdit={(postId, data) => handlePostAction({ type: 'edit', postId, data })}
              />
            ) : (
              posts.map((post) => (
                <Post 
                  key={post.postID} 
                  post={post}
                  openCommentModal={handleOpenCommentModal}
                  onLike={() => handleLikePost(post.postID)}
                  onRetweet={() => handleRetweetPost(post.postID)}
                  onClick={() => handleOpenPost(post)}
                  onEdit={(postId, data) => handlePostAction({ type: 'edit', postId, data })}
                />
              ))
            )}
            </div>
          </div>
        )}
      </main>
      <Footer />
      <Modal isOpen={!!modalType} onClose={closeModal}>
        {modalType === 'login' && (
          <LoginForm 
            onClose={closeModal} 
            onLogin={handleLogin}
            onRegisterClick={handleRegisterClick}
          />
        )}
       {modalType === 'register' && (
          <RegisterForm 
            onClose={closeModal} 
            onLoginClick={() => {
              closeModal();
              openModal('login');
            }}
          />
        )}
      {modalType === 'comment' && selectedPostForComment && (
          <CommentForm
              postID={selectedPostForComment.postID}
              onClose={closeModal}
              onCommentSubmitted={handleCommentSubmitted}
            />
        )}
        {(modalType === 'createPost' || showPostForm) && (
          <PostForm 
            onSubmit={handleCreatePost} 
            onClose={() => {
              setShowPostForm(false);
              closeModal();
            }} 
          />
        )}
       {modalType === 'viewPost' && selectedPostForComment && (
        <Post 
          post={selectedPostForComment}
          isFullView={true}
          openCommentModal={handleOpenCommentModal}
          onLike={() => handleLikePost(selectedPostForComment.postID)}
          onRetweet={() => handleRetweetPost(selectedPostForComment.postID)}
        />
      )}
      </Modal>
    </div>
  );
};

export default Home;