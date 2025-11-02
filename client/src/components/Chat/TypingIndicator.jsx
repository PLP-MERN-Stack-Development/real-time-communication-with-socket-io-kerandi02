import React from 'react';

const TypingIndicator = ({ typingUsers }) => {
  if (typingUsers.length === 0) return null;

  const names = typingUsers.map((user) => user.username).join(', ');

  return (
    <div className="px-4 py-2 text-sm text-gray-600">
      <div className="flex items-center gap-2">
        <div className="typing-indicator flex gap-1">
          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
        </div>
        <span>
          {names} {typingUsers.length === 1 ? 'is' : 'are'} typing...
        </span>
      </div>
    </div>
  );
};

export default TypingIndicator;