export function formatRelativeTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const diffSeconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (diffSeconds < 60) return 'hozir';

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes} daqiqa oldin`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} soat oldin`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} kun oldin`;

  return date.toLocaleDateString('ru-RU');
}

export function displayName(user) {
  return user?.name || user?.email || 'Foydalanuvchi';
}
