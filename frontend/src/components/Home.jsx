import React, { useState, useEffect } from 'react';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Post from './post/Post';
import Modal from './Modal';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import axios from '../utils/axiosConfig';

const Home = () => {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [userRole, setUserRole] = useState('guest'); // Default role is 'guest'
  const [username, setUsername] = useState('');
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    // Fetch user role and username from local storage
    const role = localStorage.getItem('userRole') || 'guest';
    const storedUsername = localStorage.getItem('username') || '';
    setUserRole(role);
    setUsername(storedUsername);

    // Fetch recent posts if user is logged in
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

  const handleLogin = (role, username) => {
    setUserRole(role);
    setUsername(username);
    closeLoginModal();
    fetchRecentPosts(); // Fetch recent posts after login
  };

  const handleLogout = () => {
    setUserRole('guest');
    setUsername('');
    setPosts([]);
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const closePostModal = () => {
    setSelectedPost(null);
  };

  return (
    <div id="root">
      <Header openLoginModal={openLoginModal} openRegisterModal={openRegisterModal} userRole={userRole} onLogout={handleLogout} username={username} />
      <main className="content">
        {userRole === 'guest' ? (
          <h1>Welcome to Postoria</h1>
        ) : (
          <div className="posts">
            {posts.map((post) => (
              <Post key={post.postID} post={post} onClick={handlePostClick} />
            ))}
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
      {selectedPost && (
        <Modal isOpen={!!selectedPost} onClose={closePostModal}>
          <div className="post-details">
            <h2>{selectedPost.User.username}</h2>
            <p>{selectedPost.content}</p>
            <div className="comments">
              {selectedPost.Comments.map((comment) => (
                <div key={comment.commentID} className="comment">
                  <span>{comment.content}</span>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Home;