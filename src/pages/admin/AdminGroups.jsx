import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Pencil, Trash2, RefreshCw } from 'lucide-react';
import { Button, Badge } from '../../components/ui';
import { fetchAccounts, updateAccount } from '../../api/auth';
import { listCourses } from '../../services/courses';
import { createGroup, deleteGroup, listGroups, updateGroup } from '../../services/groups';
import AdminModal from './AdminModal';
import { getStudents } from './adminUtils';

const EMPTY_FORM = { name: '', courseId: '', mentor: '', days: '' };

export default function AdminGroups() {
  const [groups, setGroups] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const [modalMode, setModalMode] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  async function loadData() {
    setError('');
    setGroups(listGroups());
    setCourses(listCourses());
    try {
      setAccounts(await fetchAccounts());
    } catch (err) {
      setError(err.message || 'Akkauntlarni yuklashda xatolik');
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const students = useMemo(() => getStudents(accounts), [accounts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return groups;
    return groups.filter(group =>
      String(group.name || '').toLowerCase().includes(q) ||
      String(group.mentor || '').toLowerCase().includes(q)
    );
  }, [groups, search]);

  function courseName(courseId) {
    return courses.find(course => String(course.id) === String(courseId))?.name || '—';
  }

  function openCreate() {
    setModalMode('create');
    setEditingGroup(null);
    setForm(EMPTY_FORM);
    setFormError('');
  }

  function openEdit(group) {
    setModalMode('edit');
    setEditingGroup(group);
    setForm({
      name: group.name || '',
      courseId: group.courseId || '',
      mentor: group.mentor || '',
      days: group.days || '',
    });
    setFormError('');
  }

  function closeModal() {
    setModalMode(null);
    setEditingGroup(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setSaving(false);
  }

  function handleSave(e) {
    e.preventDefault();
    setFormError('');
    if (!form.name.trim()) {
      setFormError('Guruh nomini kiriting');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        courseId: form.courseId,
        mentor: form.mentor.trim(),
        days: form.days.trim(),
      };
      if (modalMode === 'edit' && editingGroup) {
        updateGroup(editingGroup.id, payload);
      } else {
        createGroup(payload);
      }
      closeModal();
      loadData();
    } catch (err) {
      setFormError(err.message || 'Saqlashda xatolik');
      setSaving(false);
    }
  }

  async function handleDelete(group) {
    if (!window.confirm(`"${group.name}" guruhini o'chirmoqchimisiz?`)) return;
    try {
      const studentIds = group.studentIds || [];
      await Promise.allSettled(
        studentIds.map(studentId =>
          updateAccount(studentId, { groupId: '', groupName: '', group: '' })
        )
      );
      deleteGroup(group.id);
      await loadData();
    } catch (err) {
      setError(err.message || 'O‘chirishda xatolik');
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="page-title">Guruhlar</h1>
          <div className="admin-subtitle">Guruhlar, kurslar va o‘quvchilarni boshqarish</div>
        </div>
        <div className="admin-chip-row">
          <Button variant="ghost" size="sm" onClick={loadData}>
            <RefreshCw size={16} /> Yangilash
          </Button>
          <Button variant="accent" onClick={openCreate}>+ Guruh yaratish</Button>
        </div>
      </div>

      <div className="admin-toolbar">
        <input
          className="admin-search"
          type="search"
          placeholder="Guruh yoki mentor bo‘yicha qidirish..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {error && <div className="admin-form-error" style={{ marginBottom: 16 }}>{error}</div>}

      {filtered.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">🗂</div>
          <h3>Hali guruh yo‘q</h3>
          <p>Yangi guruh yarating, o‘quvchilarni qo‘shing va kurs biriktiring.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nomi</th>
                <th>Kursi</th>
                <th>Mentor</th>
                <th>Dars kunlari</th>
                <th>O‘quvchilar</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(group => (
                <tr key={group.id}>
                  <td className="admin-row-title">{group.name}</td>
                  <td>{courseName(group.courseId)}</td>
                  <td>{group.mentor || '—'}</td>
                  <td className="muted">{group.days || '—'}</td>
                  <td><Badge variant="accent">{(group.studentIds || []).length} ta</Badge></td>
                  <td>
                    <div className="admin-actions">
                      <Link className="admin-icon-btn" to={`/admin/groups/${group.id}`} title="Batafsil">
                        <Eye size={16} />
                      </Link>
                      <button className="admin-icon-btn" title="Tahrirlash" onClick={() => openEdit(group)}>
                        <Pencil size={16} />
                      </button>
                      <button className="admin-icon-btn danger" title="O‘chirish" onClick={() => handleDelete(group)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="admin-filters-note" style={{ marginTop: 12 }}>
        Jami studentlar: {students.length} ta
      </div>

      {modalMode && (
        <AdminModal
          title={modalMode === 'create' ? 'Yangi guruh' : 'Guruhni tahrirlash'}
          onClose={closeModal}
          footer={
            <>
              <Button variant="ghost" onClick={closeModal} disabled={saving}>Bekor qilish</Button>
              <Button variant="accent" type="submit" form="group-form" disabled={saving}>
                {saving ? 'Saqlanmoqda...' : 'Saqlash'}
              </Button>
            </>
          }
        >
          <form id="group-form" className="admin-form" onSubmit={handleSave}>
            <div className="admin-field">
              <label htmlFor="group-name">Guruh nomi</label>
              <input
                id="group-name"
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Masalan: React-Pro 12"
              />
            </div>

            <div className="admin-field">
              <label htmlFor="group-course">Kurs</label>
              <select
                id="group-course"
                value={form.courseId}
                onChange={e => setForm({ ...form, courseId: e.target.value })}
              >
                <option value="">Kurs tanlanmagan</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </select>
              <span className="admin-field-hint">
                Kurs biriktirilganda guruhdagi barcha o‘quvchilarda 0% progress bilan paydo bo‘ladi.
              </span>
            </div>

            <div className="admin-form-grid">
              <div className="admin-field">
                <label htmlFor="group-mentor">Mentor nomi</label>
                <input
                  id="group-mentor"
                  type="text"
                  value={form.mentor}
                  onChange={e => setForm({ ...form, mentor: e.target.value })}
                  placeholder="Masalan: Aziz Karimov"
                />
              </div>
              <div className="admin-field">
                <label htmlFor="group-days">Dars kunlari</label>
                <input
                  id="group-days"
                  type="text"
                  value={form.days}
                  onChange={e => setForm({ ...form, days: e.target.value })}
                  placeholder="Masalan: Du-Cho-Ju 18:00"
                />
              </div>
            </div>

            {formError && <div className="admin-form-error" role="alert">{formError}</div>}
          </form>
        </AdminModal>
      )}
    </div>
  );
}
