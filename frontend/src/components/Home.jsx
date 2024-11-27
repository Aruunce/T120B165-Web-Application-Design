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

  const handleOpenCommentModal = (post) => {
    setSelectedPostForComment(post);
    setModalType('comment');
  };

  const handleCommentSubmitted = async (newComment) => {
    try {
      // Update posts state optimistically
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.postID === newComment.postID
            ? {
                ...post,
                Comments: [newComment, ...post.Comments],
              }
            : post
        )
      );
    
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
  
      closeModal();
      
      // Refresh posts to ensure consistency
      await fetchRecentPosts();
    } catch (error) {
      console.error('Error handling comment submission:', error);
    }
  };
  
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
    console.log('Updated posts:', posts);
  }, [posts]);
  
  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'guest';
    const storedUsername = localStorage.getItem('username') || '';
    setUserRole(role);
    setUsername(storedUsername);

    if (role !== 'guest') {
      fetchRecentPosts();
    }
  }, []);

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
  
      // Add new post to state
      setPosts((prevPosts) => [newPost, ...prevPosts]);
      
      // Close create post modal
      closeModal();
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
  
      // Open post in full screen view
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
      return (
        <div className="full-screen-post">
          <Post 
            post={newPost}
            isFullView={true}
            openCommentModal={handleOpenCommentModal}
            onLike={() => handleLikePost(newPost.postID)}
            onRetweet={() => handleRetweetPost(newPost.postID)}
          />
        </div>
      );
  
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
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
              <button className="create-post-btn" onClick={() => {/* Create post logic here */}}>
                Create New Post
              </button>
            )}
            <div className="posts">
              {posts.map((post) => (
                <Post 
                  key={post.postID} 
                  post={post}
                  openCommentModal={handleOpenCommentModal}
                  onLike={() => handleLikePost(post.postID)}
                  onRetweet={() => handleRetweetPost(post.postID)}
                />
              ))}
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
        <div className="modal-content">
          <CommentForm
              postID={selectedPostForComment.postID}
              onClose={() => closeModal()}
              onCommentSubmitted={(newComment) =>
                handleCommentSubmitted(newComment, selectedPostForComment.postID)
              }
            />
        </div>
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