import React, { useState } from 'react';
import RoomList from '../components/Chat/RoomList';
import ChatRoom from '../components/Chat/ChatRoom';
import UserList from '../components/Chat/UserList';

const ChatPage = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState('rooms'); // 'rooms' or 'users'

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          showSidebar ? 'w-full sm:w-80' : 'w-0'
        } bg-white border-r transition-all duration-300 overflow-hidden flex flex-col`}
      >
        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('rooms')}
            className={`flex-1 py-3 text-center font-medium transition ${
              activeTab === 'rooms'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Rooms
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-3 text-center font-medium transition ${
              activeTab === 'users'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Users
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'rooms' ? <RoomList /> : <UserList />}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Toggle Sidebar Button (Mobile) */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="sm:hidden bg-primary-600 text-white p-3 text-center"
        >
          {showSidebar ? '← Hide Sidebar' : '☰ Show Sidebar'}
        </button>

        <ChatRoom />
      </div>
    </div>
  );
};

export default ChatPage;