// Yagona manba: admin akkaunt(lar) ro'yxati.
// API'da "role" maydoni bo'lmasa, shu email'lar admin deb hisoblanadi.
// Yangi admin qo'shish faqat shu yerda (kod orqali) mumkin — UI'da bunday imkoniyat yo'q.
export const ADMIN_EMAILS = ['admin@gmail.com'];

export function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

export function isAdminEmail(email) {
  return ADMIN_EMAILS.includes(normalizeEmail(email));
}

/**
 * API javobidagi rol + config asosida rolni aniqlaydi.
 * API "role": "admin" qaytarsa — admin; aks holda admin email config'i.
 */
export function resolveRole(account) {
  if (!account) return 'student';
  const apiRole = String(account.role || '').trim().toLowerCase();
  if (apiRole === 'admin') return 'admin';
  if (isAdminEmail(account.email)) return 'admin';
  return 'student';
}

export function isAdminAccount(account) {
  return resolveRole(account) === 'admin';
}

export function isBlockedAccount(account) {
  if (!account) return false;
  return account.status === 'blocked' || account.blocked === true;
}
