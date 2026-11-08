// Note: mockapi is only for this learning project, and passwords are stored in plain text.
import { isAdminAccount, isBlockedAccount, normalizeEmail, resolveRole } from '../config/auth';

const BASE_URL = 'https://6ae9ba4d3d3dd3d37be58d3a.mockapi.io/quiz';

function networkError(err) {
  if (err.name === 'TypeError' || String(err.message).includes('fetch')) {
    return new Error("Server bilan bog'lanishda xatolik yuz berdi. Internet aloqasini tekshiring.");
  }
  return err;
}

/**
 * Fetch all registered accounts from mockapi.io
 * @returns {Promise<Array>} List of account objects
 */
export async function fetchAccounts() {
  try {
    const response = await fetch(BASE_URL, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Server xatosi: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    throw networkError(err);
  }
}

/**
 * Create a new account in mockapi.io
 * @param {Object} accountData
 * @returns {Promise<Object>} Created account object
 */
export async function createAccount(accountData) {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(accountData),
    });

    if (!response.ok) {
      throw new Error(`Akkaunt yaratishda xatolik: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    throw networkError(err);
  }
}

/**
 * Update an existing account (merges current fields and sends PUT).
 */
export async function updateAccount(id, updates) {
  try {
    const accounts = await fetchAccounts();
    const current = accounts.find(acc => String(acc.id) === String(id));
    if (!current) throw new Error('Akkaunt topilmadi');

    const merged = { ...current, ...updates };
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(merged),
    });

    if (!response.ok) {
      throw new Error(`Akkauntni yangilashda xatolik: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    throw networkError(err);
  }
}

export async function deleteAccount(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Akkauntni o'chirishda xatolik: ${response.status}`);
    }

    return true;
  } catch (err) {
    throw networkError(err);
  }
}

/**
 * Admin tomonidan student yaratish. Har doim role: "student" bo'ladi.
 * Admin yaratish uchun hech qanday yo'l yo'q.
 */
export async function createStudentAccount({ email, password, name = '', group = null }) {
  const normalizedEmail = normalizeEmail(email);

  const accounts = await fetchAccounts();
  const exists = accounts.some(acc => normalizeEmail(acc.email) === normalizedEmail);
  if (exists) {
    throw new Error("Bu email allaqachon ro'yxatdan o'tgan");
  }

  const displayName = String(name || '').trim() || normalizedEmail.split('@')[0];
  const created = await createAccount({
    email: normalizedEmail,
    password,
    name: displayName,
    role: 'student',
    status: 'active',
    groupId: group?.id || '',
    groupName: group?.name || '',
    group: group?.name || '',
    createdAt: new Date().toISOString(),
  });

  return sanitizeAccount(created);
}

/**
 * Login a user and return safe user data with a resolved role.
 * Blocked accounts cannot log in.
 */
export async function loginUser({ email, password }) {
  const normalizedEmail = normalizeEmail(email);
  const accounts = await fetchAccounts();

  const account = accounts.find(
    acc =>
      normalizeEmail(acc.email) === normalizedEmail &&
      acc.password === password
  );

  if (!account) {
    throw new Error("Email yoki parol noto'g'ri");
  }

  if (isBlockedAccount(account)) {
    throw new Error('Akkaunt bloklangan');
  }

  return sanitizeAccount(account);
}

export function sanitizeAccount(account) {
  if (!account) return null;
  const safe = { ...account };
  delete safe.password;
  safe.role = resolveRole(account);
  safe.status = account.status || 'active';
  return safe;
}

export { isAdminAccount, isBlockedAccount };
