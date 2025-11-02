 import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { useSocket } from '../../context/SocketContext';
import { searchMessages } from '../../services/api';

const ChatRoom = () => {
  const { currentRoom, leaveRoom, typingUsers, messages } = useChat();
  const { user, logout } = useAuth();
  const { connected } = useSocket();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim() || !currentRoom) return;

    setSearching(true);
    try {
      const response = await searchMessages(searchQuery, currentRoom._id);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearch(false);
  };

  if (!currentRoom) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Welcome to Chat App
          </h2>
          <p className="text-gray-500">
            Select a room from the sidebar to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <button
              onClick={leaveRoom}
              className="text-gray-600 hover:text-gray-800 md:hidden"
            >
              ← Back
            </button>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {currentRoom.name}
              </h2>
              <p className="text-sm text-gray-500">
                {currentRoom.members?.length || 0} members
                {connected ? (
                  <span className="ml-2 text-green-600">● Connected</span>
                ) : (
                  <span className="ml-2 text-red-600">● Disconnected</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Button */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              title="Search messages"
            >
              🔍
            </button>

            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-800">{user.username}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <img
              src={user.avatar}
              alt={user.username}
              className="w-10 h-10 rounded-full"
            />
            <button
              onClick={logout}
              className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="mt-3">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
              <button
                type="submit"
                disabled={searching}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm disabled:opacity-50"
              >
                {searching ? 'Searching...' : 'Search'}
              </button>
              {searchResults.length > 0 && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm"
                >
                  Clear
                </button>
              )}
            </form>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-2 max-h-40 overflow-y-auto bg-gray-50 rounded-lg p-2">
                <p className="text-xs text-gray-600 mb-2">
                  Found {searchResults.length} result(s)
                </p>
                {searchResults.map((msg) => (
                  <div key={msg._id} className="p-2 bg-white rounded mb-1 text-sm">
                    <p className="font-medium text-gray-800">
                      {msg.sender.username}
                    </p>
                    <p className="text-gray-600">{msg.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Messages */}
      <MessageList filteredMessages={searchResults.length > 0 ? searchResults : messages} />

      {/* Typing Indicator */}
      <TypingIndicator typingUsers={typingUsers} />

      {/* Message Input */}
      <MessageInput />
    </div>
  );
};

export default ChatRoom;