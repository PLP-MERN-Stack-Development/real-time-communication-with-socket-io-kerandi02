 import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { formatMessageTime } from '../../utils/formatDate';

const MessageList = ({ filteredMessages }) => {
  const { messages, markAsRead, addReaction } = useChat();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const [showReactionPicker, setShowReactionPicker] = useState(null);

  const displayMessages = filteredMessages || messages;
  const reactions = ['👍', '❤️', '😂', '😮', '😢', '🎉'];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleReaction = (messageId, emoji) => {
    addReaction(messageId, emoji);
    setShowReactionPicker(null);
  };

  const isOwnMessage = (message) => {
    return message.sender._id === user._id;
  };

  const getDeliveryStatus = (message) => {
    if (!isOwnMessage(message)) return null;

    // Check if message has been read by anyone
    if (message.readBy && message.readBy.length > 0) {
      return { icon: '✓✓', color: 'text-blue-400', text: 'Read' };
    }
    // Message delivered but not read
    return { icon: '✓✓', color: 'text-gray-400', text: 'Delivered' };
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      {displayMessages.map((message) => {
        const deliveryStatus = getDeliveryStatus(message);
        
        return (
          <div
            key={message._id}
            className={`flex ${isOwnMessage(message) ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-2 max-w-[70%] ${isOwnMessage(message) ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <img
                src={message.sender.avatar}
                alt={message.sender.username}
                className="w-8 h-8 rounded-full flex-shrink-0"
              />

              {/* Message Bubble */}
              <div>
                {!isOwnMessage(message) && (
                  <p className="text-xs text-gray-600 mb-1 px-2">
                    {message.sender.username}
                  </p>
                )}

                <div
                  className={`message-bubble px-4 py-2 rounded-lg ${
                    isOwnMessage(message)
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <p className="break-words">{message.content}</p>

                  {/* Reactions */}
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {message.reactions.map((reaction, idx) => (
                        <span
                          key={idx}
                          className="text-sm bg-gray-100 px-2 py-1 rounded"
                          title={`Reacted by user`}
                        >
                          {reaction.emoji}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-1 gap-2">
                    <p className={`text-xs ${isOwnMessage(message) ? 'text-primary-100' : 'text-gray-500'}`}>
                      {formatMessageTime(message.createdAt)}
                    </p>

                    {/* Reaction Button */}
                    <button
                      onClick={() => setShowReactionPicker(showReactionPicker === message._id ? null : message._id)}
                      className={`text-xs ${isOwnMessage(message) ? 'text-primary-100' : 'text-gray-500'} hover:text-gray-700`}
                    >
                      +
                    </button>
                  </div>

                  {/* Delivery Status */}
                  {deliveryStatus && (
                    <div className={`flex items-center gap-1 mt-1 text-xs ${deliveryStatus.color}`}>
                      <span>{deliveryStatus.icon}</span>
                      <span>{deliveryStatus.text}</span>
                      {message.readBy && message.readBy.length > 0 && (
                        <span>by {message.readBy.length}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Reaction Picker */}
                {showReactionPicker === message._id && (
                  <div className="reaction-picker mt-2">
                    {reactions.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleReaction(message._id, emoji)}
                        className="reaction-button text-xl"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {displayMessages.length === 0 && (
        <div className="flex items-center justify-center h-full text-gray-500">
          No messages yet. Start the conversation!
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;