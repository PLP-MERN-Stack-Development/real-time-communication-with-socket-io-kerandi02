import React, { useState, useEffect } from 'react';
import { getUsers } from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import { formatLastSeen } from '../../utils/formatDate';

const UserList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { onlineUsers } = useSocket();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-800">Users</h3>
      </div>

      <div className="divide-y">
        {users.map((user) => (
          <div
            key={user._id}
            onClick={() => onSelectUser(user)}
            className="p-4 hover:bg-gray-50 cursor-pointer transition"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-12 h-12 rounded-full"
                />
                {isUserOnline(user._id) && (
                  <span className="online-indicator"></span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">
                  {user.username}
                </h4>
                <p className="text-sm text-gray-500">
                  {isUserOnline(user._id) ? (
                    <span className="text-green-600">Online</span>
                  ) : (
                    <span>Last seen {formatLastSeen(user.lastSeen)}</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No users found
        </div>
      )}
    </div>
  );
};

export default UserList;