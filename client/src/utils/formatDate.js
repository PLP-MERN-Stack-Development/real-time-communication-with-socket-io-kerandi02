import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';

export const formatMessageTime = (date) => {
  const messageDate = new Date(date);
  
  if (isToday(messageDate)) {
    return format(messageDate, 'HH:mm');
  } else if (isYesterday(messageDate)) {
    return `Yesterday ${format(messageDate, 'HH:mm')}`;
  } else {
    return format(messageDate, 'MMM dd, HH:mm');
  }
};

export const formatLastSeen = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatFullDate = (date) => {
  return format(new Date(date), 'PPP p');
};