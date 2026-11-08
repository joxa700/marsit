import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  Ban,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { Button, Badge } from '../../components/ui';
import {
  createStudentAccount,
  deleteAccount,
  fetchAccounts,
  updateAccount,
} from '../../api/auth';
import { isAdminAccount, normalizeEmail } from '../../config/auth';
import {
  addStudentToGroup,
  findGroupOfStudent,
  listGroups,
  removeStudentFromGroup,
} from '../../services/groups';
import AdminModal from './AdminModal';
import {
  findStudentGroup,
  formatDate,
  getStudents,
  groupNameFor,
  isBlocked,
} from './adminUtils';

const EMPTY_FORM = {
  name: '',
  email: '',
  password: '',
  groupId: '',
};

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  let out = 'Mars';
  for (let i = 0; i < 6; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export default function AdminStudents() {
  const [accounts, setAccounts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('all');

  const [modalMode, setModalMode] = useState(null);
  const [editingAccount, setEditingAccount] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAccounts();
      setAccounts(data);
      setGroups(listGroups());
    } catch (err) {
      setError(err.message || 'Ma’lumotlarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const students = useMemo(() => getStudents(accounts), [accounts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return students.filter(account => {
      const group = findStudentGroup(account, groups);
      const groupName = groupNameFor(account, groups);

      if (groupFilter === 'none' && group) return false;
      if (groupFilter !== 'all' && groupFilter !== 'none' && String(group?.id) !== groupFilter) {
        return false;
      }

      if (!q) return true;
      return (
        String(account.name || '').toLowerCase().includes(q) ||
        String(account.email || '').toLowerCase().includes(q) ||
        groupName.toLowerCase().includes(q)
      );
    });
  }, [students, groups, search, groupFilter]);

  function openCreate() {
    setModalMode('create');
    setEditingAccount(null);
    setForm(EMPTY_FORM);
    setShowPassword(false);
    setFormError('');
  }

  function openEdit(account) {
    if (isAdminAccount(account)) {
      setError('Admin akkauntini tahrirlab bo‘lmaydi');
      return;
    }
    const group = findStudentGroup(account, groups);
    setModalMode('edit');
    setEditingAccount(account);
    setForm({
      name: account.name || '',
      email: account.email || '',
      password: '',
      groupId: group?.id || account.groupId || '',
    });
    setShowPassword(false);
    setFormError('');
  }

  function closeModal() {
    setModalMode(null);
    setEditingAccount(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setSaving(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    setFormError('');

    const name = form.name.trim();
    const group = groups.find(item => String(item.id) === String(form.groupId)) || null;

    if (modalMode === 'create') {
      const email = form.email.trim();
      if (!emailRegex.test(email)) {
        setFormError("Email formati noto'g'ri (masalan: user@marsit.uz)");
        return;
      }
      if (form.password.length < 6) {
        setFormError("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
        return;
      }
      if (students.some(acc => normalizeEmail(acc.email) === normalizeEmail(email))) {
        setFormError("Bu email allaqachon ro'yxatdan o'tgan");
        return;
      }

      setSaving(true);
      try {
        const created = await createStudentAccount({
          email,
          password: form.password,
          name,
          group,
        });
        if (group) {
          addStudentToGroup(group.id, created.id);
        }
        closeModal();
        await loadData();
      } catch (err) {
        setFormError(err.message || 'Akkaunt yaratishda xatolik');
        setSaving(false);
      }
      return;
    }

    if (!editingAccount) return;
    if (isAdminAccount(editingAccount)) {
      setFormError('Admin akkauntini tahrirlab bo‘lmaydi');
      return;
    }
    if (form.password && form.password.length < 6) {
      setFormError("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
      return;
    }

    setSaving(true);
    try {
      const currentGroup = findGroupOfStudent(editingAccount.id);
      if (group && String(group.id) !== String(currentGroup?.id || '')) {
        addStudentToGroup(group.id, editingAccount.id);
      } else if (!group && currentGroup) {
        removeStudentFromGroup(currentGroup.id, editingAccount.id);
      }

      const updates = {
        name: name || editingAccount.email.split('@')[0],
        groupId: group?.id || '',
        groupName: group?.name || '',
        group: group?.name || '',
      };
      if (form.password) updates.password = form.password;

      await updateAccount(editingAccount.id, updates);
      closeModal();
      await loadData();
    } catch (err) {
      setFormError(err.message || 'Saqlashda xatolik');
      setSaving(false);
    }
  }

  async function handleToggleBlock(account) {
    if (isAdminAccount(account)) return;
    const blocked = isBlocked(account);
    try {
      await updateAccount(account.id, { status: blocked ? 'active' : 'blocked' });
      await loadData();
    } catch (err) {
      setError(err.message || 'Holatni o‘zgartirishda xatolik');
    }
  }

  async function handleDelete(account) {
    if (isAdminAccount(account)) {
      alert('Admin akkauntini o‘chirib bo‘lmaydi');
      return;
    }
    if (!window.confirm(`"${account.name || account.email}" akkauntini o'chirmoqchimisiz?`)) return;
    try {
      const group = findGroupOfStudent(account.id);
      if (group) removeStudentFromGroup(group.id, account.id);
      await deleteAccount(account.id);
      await loadData();
    } catch (err) {
      setError(err.message || 'O‘chirishda xatolik');
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="page-title">O‘quvchilar</h1>
          <div className="admin-subtitle">Akkauntlarni yaratish va boshqarish</div>
        </div>
        <div className="admin-chip-row">
          <Button variant="ghost" size="sm" onClick={loadData} disabled={loading}>
            <RefreshCw size={16} /> Yangilash
          </Button>
          <Button variant="accent" onClick={openCreate}>+ Student qo‘shish</Button>
        </div>
      </div>

      <div className="admin-toolbar">
        <input
          className="admin-search"
          type="search"
          placeholder="Ism yoki email bo‘yicha qidirish..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={groupFilter} onChange={e => setGroupFilter(e.target.value)}>
          <option value="all">Barcha guruhlar</option>
          <option value="none">Guruhsiz</option>
          {groups.map(group => (
            <option key={group.id} value={group.id}>{group.name}</option>
          ))}
        </select>
      </div>

      {error && <div className="admin-form-error" style={{ marginBottom: 16 }}>{error}</div>}

      {loading ? (
        <div className="admin-empty">Yuklanmoqda...</div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">👥</div>
          <h3>O‘quvchilar topilmadi</h3>
          <p>Qidiruv yoki filtrni o‘zgartiring, yoki yangi student qo‘shing.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ism</th>
                <th>Email / login</th>
                <th>Guruh</th>
                <th>Yaratilgan</th>
                <th>Holati</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(account => {
                const blocked = isBlocked(account);
                const group = findStudentGroup(account, groups);
                return (
                  <tr key={account.id}>
                    <td className="admin-row-title">{account.name || '—'}</td>
                    <td>{account.email}</td>
                    <td>{group?.name || account.groupName || account.group || '—'}</td>
                    <td className="muted">{formatDate(account.createdAt)}</td>
                    <td>
                      <Badge variant={blocked ? 'danger' : 'success'}>
                        {blocked ? 'Bloklangan' : 'Faol'}
                      </Badge>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <Link
                          className="admin-icon-btn"
                          to={`/admin/students/${account.id}`}
                          title="Batafsil"
                        >
                          <Eye size={16} />
                        </Link>
                        <button
                          className="admin-icon-btn"
                          title="Tahrirlash"
                          onClick={() => openEdit(account)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="admin-icon-btn"
                          title={blocked ? 'Blokdan chiqarish' : 'Bloklash'}
                          onClick={() => handleToggleBlock(account)}
                        >
                          {blocked ? <CheckCircle2 size={16} /> : <Ban size={16} />}
                        </button>
                        <button
                          className="admin-icon-btn danger"
                          title="O‘chirish"
                          onClick={() => handleDelete(account)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modalMode && (
        <AdminModal
          title={modalMode === 'create' ? 'Yangi student qo‘shish' : 'Studentni tahrirlash'}
          onClose={closeModal}
          footer={
            <>
              <Button variant="ghost" onClick={closeModal} disabled={saving}>Bekor qilish</Button>
              <Button variant="accent" type="submit" form="student-form" disabled={saving}>
                {saving ? 'Saqlanmoqda...' : 'Saqlash'}
              </Button>
            </>
          }
        >
          <form id="student-form" className="admin-form" onSubmit={handleSave}>
            <div className="admin-field">
              <label htmlFor="student-name">Ism</label>
              <input
                id="student-name"
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Ism va familiya"
              />
            </div>

            <div className="admin-field">
              <label htmlFor="student-email">Login (email)</label>
              <input
                id="student-email"
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="student@marsit.uz"
                disabled={modalMode === 'edit'}
                readOnly={modalMode === 'edit'}
              />
              {modalMode === 'edit' && (
                <span className="admin-field-hint">Email/login o‘zgartirilmaydi.</span>
              )}
            </div>

            <div className="admin-field">
              <label htmlFor="student-password">
                {modalMode === 'create' ? 'Parol' : 'Yangi parol (ixtiyoriy)'}
              </label>
              <div className="admin-password-row">
                <input
                  id="student-password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder={modalMode === 'create' ? 'Kamida 6 ta belgi' : 'Bo‘sh qoldirsangiz o‘zgarmaydi'}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="admin-icon-btn"
                  onClick={() => setShowPassword(prev => !prev)}
                  title={showPassword ? 'Yashirish' : 'Ko‘rsatish'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="admin-inline-actions">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    setForm(prev => ({ ...prev, password: generatePassword() }));
                    setShowPassword(true);
                  }}
                >
                  Parol generatsiya qilish
                </button>
              </div>
            </div>

            <div className="admin-field">
              <label htmlFor="student-group">Guruh (ixtiyoriy)</label>
              <select
                id="student-group"
                value={form.groupId}
                onChange={e => setForm({ ...form, groupId: e.target.value })}
              >
                <option value="">Guruhsiz</option>
                {groups.map(group => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </select>
              <span className="admin-field-hint">
                Guruhga qo‘shilganda, guruh kursi 0% progress bilan biriktiriladi.
              </span>
            </div>

            {formError && <div className="admin-form-error" role="alert">{formError}</div>}
          </form>
        </AdminModal>
      )}
    </div>
  );
}
