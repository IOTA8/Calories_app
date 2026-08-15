/**
 * Date and formatting utilities
 */

export function formatDateKey(dateObj = new Date()) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDisplayDate(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const targetWithoutTime = new Date(year, month - 1, day);

  if (targetWithoutTime.getTime() === today.getTime()) {
    return 'Today';
  } else if (targetWithoutTime.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  } else if (targetWithoutTime.getTime() === tomorrow.getTime()) {
    return 'Tomorrow';
  }

  return targetDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

export function formatTime(timestamp = Date.now()) {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

export function getPast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(formatDateKey(d));
  }
  return days;
}
