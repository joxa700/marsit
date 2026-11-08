// My Works — Mening ishlarim
import { useState } from 'react';
import { Card, CardBody, Button, Badge } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import {
  WORK_STATUS,
  createWork,
  deleteWork,
  listWorksByStudent,
  updateWork,
} from '../../services/works';
import './MyWorks.css';

const STATUS_VARIANT = {
  [WORK_STATUS.PENDING]: 'warning',
  [WORK_STATUS.RETURNED]: 'danger',
  [WORK_STATUS.ACCEPTED]: 'success',
};

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('ru-RU');
}

export default function MyWorksPage() {
  const { user } = useAuth();
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [error, setError] = useState('');

  const works = user ? listWorksByStudent(user.id) : [];

  function openCreate() {
    setEditingId(null);
    setTitle('');
    setLink('');
    setError('');
    setFormOpen(true);
  }

  function openEdit(work) {
    setEditingId(work.id);
    setTitle(work.title);
    setLink(work.link);
    setError('');
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setTitle('');
    setLink('');
    setError('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        updateWork(editingId, user.id, { title, link });
      } else {
        createWork({ studentId: user.id, title, link });
      }
      closeForm();
    } catch (err) {
      setError(err.message || 'Xatolik yuz berdi');
    }
  }

  function handleDelete(work) {
    if (!window.confirm(`"${work.title}" ishini o'chirmoqchimisiz?`)) return;
    try {
      deleteWork(work.id, user.id);
    } catch (err) {
      alert(err.message || 'Xatolik yuz berdi');
    }
  }

  return (
    <div>
      <div className="works-page-toolbar">
        <h1 className="page-title" style={{ marginBottom: 0 }}>📋 Mening ishlarim</h1>
        <Button variant="accent" onClick={openCreate}>+ Ish qo'shish</Button>
      </div>

      {formOpen && (
        <Card className="works-form-card">
          <CardBody>
            <form className="works-form" onSubmit={handleSubmit}>
              <div className="works-form-row">
                <div className="form-group">
                  <label className="form-label">Ish nomi</label>
                  <input
                    type="text"
                    placeholder="Masalan: Todo App"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Havola (GitHub / Netlify / Vercel)</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={link}
                    onChange={e => setLink(e.target.value)}
                    required
                  />
                </div>
              </div>
              {error && <div className="works-form-error" role="alert">{error}</div>}
              <div className="works-form-actions">
                <Button type="submit" variant="accent">
                  {editingId ? 'Saqlash' : "Qo'shish"}
                </Button>
                <Button type="button" variant="ghost" onClick={closeForm}>Bekor qilish</Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      {works.length === 0 ? (
        <Card>
          <CardBody>
            <div className="works-empty-state">
              <div className="works-empty-icon">📝</div>
              <h3>Hali ish qo'shilmagan</h3>
              <p>
                Bajarilgan ishingiz nomi va havolasini qo'shing. Yangi ish
                avtomatik "Tekshiruvda" holatida bo'ladi.
              </p>
              <Button variant="accent" onClick={openCreate}>+ Ish qo'shish</Button>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="works-list">
          {works.map(work => (
            <div key={work.id} className="work-item">
              <div className="work-item-main">
                <div>
                  <div className="work-item-title">{work.title}</div>
                  <a href={work.link} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem' }}>
                    🔗 {work.link}
                  </a>
                  {work.status === WORK_STATUS.RETURNED && work.comment && (
                    <div className="work-comment">💬 Admin izohi: {work.comment}</div>
                  )}
                </div>
              </div>
              <span className="work-item-date">📅 {formatDate(work.createdAt)}</span>
              <Badge variant={STATUS_VARIANT[work.status] || 'muted'}>{work.status}</Badge>
              <div className="works-item-actions">
                <Button variant="outline" size="sm" onClick={() => openEdit(work)}>✏️</Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(work)}>🗑</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
