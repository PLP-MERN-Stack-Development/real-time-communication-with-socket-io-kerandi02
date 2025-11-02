import React from 'react';

const NotificationBadge = ({ count }) => {
  if (count === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center notification-badge">
      {count > 9 ? '9+' : count}
    </span>
  );
};

export default NotificationBadge;