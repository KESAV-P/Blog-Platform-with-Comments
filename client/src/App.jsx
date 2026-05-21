import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout & Route Guard
import ProtectedRoute from './components/auth/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Blog from './pages/Blog';
import PostDetail from './pages/PostDetail';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Pages
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'glassmorphic-toast',
          style: {
            background: '#161616',
            color: '#f3e8ee',
            border: '1px solid rgba(243, 232, 238, 0.1)',
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<PostDetail />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-post"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-post/:id"
          element={
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
