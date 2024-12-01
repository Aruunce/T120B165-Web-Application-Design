import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import UserList from './components/user/UserList';
import ErrorBoundary from './components/error/ErrorBoundary';

// Add PrivateRoute component
const PrivateRoute = ({ children }) => {
  const userRole = localStorage.getItem('userRole');
  
  if (userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/users" 
            element={
              <PrivateRoute>
                <UserList />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;