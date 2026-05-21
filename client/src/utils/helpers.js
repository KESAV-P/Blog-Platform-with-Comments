import { formatDistanceToNow, format } from 'date-fns';

// Strip HTML tags
export const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
};

// Estimate post read time in minutes
export const estimateReadTime = (content) => {
  if (!content) return 1;
  const words = stripHtml(content).trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(words / 200);
  return minutes || 1;
};

// Formats mongoose timestamps nicely
export const formatDate = (dateString, relative = true) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  if (relative) {
    return formatDistanceToNow(date, { addSuffix: true });
  }
  return format(date, 'MMMM dd, yyyy');
};
