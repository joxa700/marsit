import { isAdminAccount } from '../../config/auth';

export function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('ru-RU');
}

export function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return `${date.toLocaleDateString('ru-RU')} ${date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}

export function getStudents(accounts) {
  return (accounts || []).filter(account => !isAdminAccount(account));
}

export function findStudentGroup(account, groups) {
  if (!account) return null;
  return (
    (groups || []).find(group =>
      (group.studentIds || []).some(id => String(id) === String(account.id))
    ) || null
  );
}

export function groupNameFor(account, groups) {
  const group = findStudentGroup(account, groups);
  return group?.name || account?.groupName || account?.group || '';
}

export function statusVariant(status) {
  if (status === 'Qabul qilindi') return 'success';
  if (status === 'Qaytarildi') return 'danger';
  if (status === 'Tekshiruvda') return 'warning';
  return 'muted';
}

export function isBlocked(account) {
  return account?.status === 'blocked' || account?.blocked === true;
}
