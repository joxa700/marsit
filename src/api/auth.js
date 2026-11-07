// Note: mockapi is only for this learning project, and passwords are stored in plain text.

const BASE_URL = 'https://6ae9ba4d3d3dd3d37be58d3a.mockapi.io/quiz';

/**
 * Fetch all registered accounts from mockapi.io
 * @returns {Promise<Array>} List of account objects
 */
export async function fetchAccounts() {
  try {
    const response = await fetch(BASE_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Server xatosi: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    if (err.name === 'TypeError' || err.message.includes('fetch')) {
      throw new Error("Server bilan bog'lanishda xatolik yuz berdi. Internet aloqasini tekshiring.");
    }
    throw err;
  }
}

/**
 * Create a new account in mockapi.io
 * @param {Object} accountData - { email, password, name, createdAt }
 * @returns {Promise<Object>} Created account object
 */
export async function createAccount(accountData) {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(accountData),
    });

    if (!response.ok) {
      throw new Error(`Akkaunt yaratishda xatolik: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    if (err.name === 'TypeError' || err.message.includes('fetch')) {
      throw new Error("Server bilan bog'lanishda xatolik yuz berdi. Internet aloqasini tekshiring.");
    }
    throw err;
  }
}

/**
 * Register a new user:
 * 1. Checks if email already exists (trim + case insensitive)
 * 2. If already exists, throws "Bu email allaqachon ro'yxatdan o'tgan"
 * 3. Otherwise POSTs the new user to mockapi.io and returns safe user data (without password)
 *
 * @param {Object} params - { email, password, name }
 * @returns {Promise<Object>} Safe user data without password
 */
export async function registerUser({ email, password, name = '' }) {
  const normalizedEmail = email.trim().toLowerCase();

  // 1. Fetch existing accounts to check uniqueness
  const accounts = await fetchAccounts();
  const exists = accounts.some(
    acc => acc.email && acc.email.trim().toLowerCase() === normalizedEmail
  );

  if (exists) {
    throw new Error("Bu email allaqachon ro'yxatdan o'tgan");
  }

  // 2. Prepare new user payload matching expected fields
  const displayName = name.trim() || normalizedEmail.split('@')[0];
  const newAccount = {
    email: normalizedEmail,
    password: password,
    name: displayName,
    group: 'React-Pro Guruhi',
    createdAt: new Date().toISOString(),
  };

  // 3. POST to mockapi.io
  const created = await createAccount(newAccount);

  // 4. Return safe user data without password
  const { password: _, ...safeUser } = created;
  return safeUser;
}

/**
 * Login a user:
 * 1. Fetches all accounts from mockapi.io
 * 2. Compares email (case-insensitive, trimmed) and password
 * 3. Returns safe user data if matched, or throws "Email yoki parol noto'g'ri"
 *
 * @param {Object} params - { email, password }
 * @returns {Promise<Object>} Safe user data without password
 */
export async function loginUser({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();

  // 1. Fetch accounts from mockapi.io
  const accounts = await fetchAccounts();

  // 2. Match credentials
  const account = accounts.find(
    acc =>
      acc.email &&
      acc.email.trim().toLowerCase() === normalizedEmail &&
      acc.password === password
  );

  if (!account) {
    throw new Error("Email yoki parol noto'g'ri");
  }

  // 3. Return safe user data without password
  const { password: _, ...safeUser } = account;
  return safeUser;
}
