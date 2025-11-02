import React, { useState } from 'react';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';

const HomePage = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex items-center justify-center gap-8">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:flex flex-col text-white flex-1">
          <h1 className="text-5xl font-bold mb-4">
            Welcome to ChatApp
          </h1>
          <p className="text-xl mb-6 text-primary-100">
            Connect with friends and colleagues in real-time. Experience seamless communication with our modern chat platform.
          </p>
          <ul className="space-y-3 text-lg">
            <li className="flex items-center gap-2">
              <span className="text-2xl">💬</span>
              Real-time messaging
            </li>
            <li className="flex items-center gap-2">
              <span className="text-2xl">👥</span>
              Multiple chat rooms
            </li>
            <li className="flex items-center gap-2">
              <span className="text-2xl">🔔</span>
              Instant notifications
            </li>
            <li className="flex items-center gap-2">
              <span className="text-2xl">😊</span>
              Message reactions
            </li>
            <li className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              Read receipts
            </li>
          </ul>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="flex-1 max-w-md">
          {showLogin ? (
            <Login onSwitchToRegister={() => setShowLogin(false)} />
          ) : (
            <Register onSwitchToLogin={() => setShowLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;