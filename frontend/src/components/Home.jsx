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
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isCommentModalOpen, setCommentModalOpen] = useState(false);
  const [userRole, setUserRole] = useState('guest');
  const [username, setUsername] = useState('');
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostForm, setShowPostForm] = useState(false);
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
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching recent posts:', error);
    }
  };

  const openLoginModal = () => setLoginModalOpen(true);
  const closeLoginModal = () => setLoginModalOpen(false);

  const openRegisterModal = () => setRegisterModalOpen(true);
  const closeRegisterModal = () => setRegisterModalOpen(false);

  const openCommentModal = (e) => {
    e.stopPropagation();
    setCommentModalOpen(true);
  };
  const closeCommentModal = () => setCommentModalOpen(false);

  const handleLogin = (role, username) => {
    setUserRole(role);
    setUsername(username);
    closeLoginModal();
    fetchRecentPosts();
  };

  const closePostModal = () => {
    setSelectedPost(null);
  };

  const handleCreatePost = async (postData) => {
    try {
      const response = await axios.post('/posts', {
        ...postData,
        userId: localStorage.getItem('userID')
      });
      setPosts([response.data, ...posts]);
      setShowPostForm(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

const handleLikePost = async (postId) => {
  try {
    const userId = localStorage.getItem('userID');
    await axios.post(`/posts/${postId}/like-retweet`, {
      userId,
      type: 'like'
    });
    // Update post in state
    setPosts(posts.map(post => 
      post.postID === postId 
        ? { ...post, likeCount: (post.likeCount || 0) + 1 }
        : post
    ));
  } catch (error) {
    console.error('Error liking post:', error);
  }
};

const handleRetweetPost = async (postId) => {
  try {
    const userId = localStorage.getItem('userID');
    await axios.post(`/posts/${postId}/like-retweet`, {
      userId,
      type: 'retweet'
    });
    // Update post in state
    setPosts(posts.map(post => 
      post.postID === postId 
        ? { ...post, retweetCount: (post.retweetCount || 0) + 1 }
        : post
    ));
  } catch (error) {
    console.error('Error retweeting post:', error);
  }
};
  return (
    <div id="root">
      <Header 
        openLoginModal={openLoginModal} 
        openRegisterModal={openRegisterModal} 
        userRole={userRole} 
        onLogout={() => {}} 
        username={username} 
      />
      <main className="content">
        {userRole === 'guest' ? (
          <h1>Welcome to Postoria</h1>
        ) : (
          <div>
            <button 
              className="create-post-btn"
              onClick={() => setShowPostForm(true)}
            >
            Create New Post
          </button>
          {showPostForm && (
            <Modal isOpen={showPostForm} onClose={() => setShowPostForm(false)}>
              <PostForm onSubmit={handleCreatePost} />
            </Modal>
          )}
          <div className="posts">
            {posts.map((post) => (
              <Post 
                key={post.postID} 
                post={post} 
                openCommentModal={openCommentModal}
                onLike={() => handleLikePost(post.postID)}
                onRetweet={() => handleRetweetPost(post.postID)}
              />
            ))}
          </div>
            {selectedPost && (
              <Modal isOpen={!!selectedPost} onClose={closePostModal}>
                <Post 
                  post={selectedPost} 
                  onClick={() => {}} 
                  openCommentModal={openCommentModal}
                  onLike={() => handleLikePost(selectedPost.postID)}
                  onRetweet={() => handleRetweetPost(selectedPost.postID)} 
                />
              </Modal>
            )}
          </div>
        )}
      </main>
      <Footer />
      <Modal isOpen={isLoginModalOpen} onClose={closeLoginModal}>
        <LoginForm onClose={closeLoginModal} onLogin={handleLogin} />
      </Modal>
      <Modal isOpen={isRegisterModalOpen} onClose={closeRegisterModal}>
        <RegisterForm onClose={closeRegisterModal} />
      </Modal>
      <Modal isOpen={isCommentModalOpen} onClose={closeCommentModal}>
        <CommentForm onClose={closeCommentModal} />
      </Modal>
      {selectedPost && (
        <Modal isOpen={!!selectedPost} onClose={closePostModal}>
          <Post post={selectedPost} onClick={() => {}} openCommentModal={openCommentModal} />
        </Modal>
      )}
    </div>
  );
};

export default Home;