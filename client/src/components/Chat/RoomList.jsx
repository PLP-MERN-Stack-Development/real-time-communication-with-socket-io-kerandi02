import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { formatMessageTime } from '../../utils/formatDate';

const RoomList = () => {
  const { rooms, currentRoom, joinRoom, createRoom, loading } = useChat();
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDescription, setNewRoomDescription] = useState('');

  const handleJoinRoom = (roomId) => {
    joinRoom(roomId);
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    
    if (!newRoomName.trim()) return;

    const result = await createRoom({
      name: newRoomName,
      description: newRoomDescription,
      userId: user._id,
    });

    if (result.success) {
      setNewRoomName('');
      setNewRoomDescription('');
      setShowCreateModal(false);
      joinRoom(result.room._id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading rooms...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Chat Rooms</h3>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3 py-1 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition"
        >
          + New Room
        </button>
      </div>

      <div className="flex-1 overflow-y-auto divide-y">
        {rooms.map((room) => (
          <div
            key={room._id}
            onClick={() => handleJoinRoom(room._id)}
            className={`p-4 cursor-pointer transition ${
              currentRoom?._id === room._id
                ? 'bg-primary-50 border-l-4 border-primary-600'
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">{room.name}</h4>
              {room.lastMessage && (
                <span className="text-xs text-gray-500">
                  {formatMessageTime(room.updatedAt)}
                </span>
              )}
            </div>
            {room.description && (
              <p className="text-sm text-gray-600 mt-1 truncate">
                {room.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-gray-500">
                {room.members?.length || 0} members
              </span>
              {room.roomType === 'private' && (
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                  Private
                </span>
              )}
            </div>
          </div>
        ))}

        {rooms.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No rooms available. Create one to get started!
          </div>
        )}
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Create New Room</h3>
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Name
                </label>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter room name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={newRoomDescription}
                  onChange={(e) => setNewRoomDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter room description"
                  rows="3"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomList;