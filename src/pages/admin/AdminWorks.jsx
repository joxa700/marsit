import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { Badge, Button } from '../../components/ui';
import { fetchAccounts } from '../../api/auth';
import { listGroups } from '../../services/groups';
import {
  WORK_STATUS,
  WORK_STATUS_LIST,
  listWorks,
  setWorkStatus,
} from '../../services/works';
import AdminModal from './AdminModal';
import {
  findStudentGroup,
  formatDate,
  getStudents,
  isBlocked,
  statusVariant,
} from './adminUtils';

export default function AdminWorks() {
  const [searchParams] = useSearchParams();
  const [accounts, setAccounts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [works, setWorks] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('all');
  const [studentFilter, setStudentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');

  const [commentModal, setCommentModal] = useState(null);
  const [comment, setComment] = useState('');

  async function loadData() {
    setError('');
    setGroups(listGroups());
    setWorks(listWorks());
    try {
      setAccounts(await fetchAccounts());
    } catch (err) {
      setError(err.message || 'Ma’lumotlarni yuklashda xatolik');
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const students = useMemo(() => getStudents(accounts), [accounts]);

  const accountById = useMemo(() => {
    const map = {};
    accounts.forEach(account => { map[String(account.id)] = account; });
    return map;
  }, [accounts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return works.filter(work => {
      const account = accountById[String(work.studentId)];
      const group = findStudentGroup(account, groups);

      if (statusFilter !== 'all' && work.status !== statusFilter) return false;
      if (groupFilter !== 'all' && String(group?.id || '') !== groupFilter) return false;
      if (studentFilter !== 'all' && String(work.studentId) !== studentFilter) return false;

      if (!q) return true;
      return (
        String(work.title || '').toLowerCase().includes(q) ||
        String(work.link || '').toLowerCase().includes(q) ||
        String(account?.name || '').toLowerCase().includes(q) ||
        String(account?.email || '').toLowerCase().includes(q)
      );
    });
  }, [works, accountById, groups, statusFilter, groupFilter, studentFilter, search]);

  function handleStatusChange(work, status) {
    if (status === WORK_STATUS.RETURNED) {
      setCommentModal(work);
      setComment(work.comment || '');
      return;
    }
    try {
      setWorkStatus(work.id, status, '');
      loadData();
    } catch (err) {
      setError(err.message || 'Holatni saqlashda xatolik');
    }
  }

  function saveComment() {
    if (!commentModal) return;
    try {
      setWorkStatus(commentModal.id, WORK_STATUS.RETURNED, comment);
      setCommentModal(null);
      setComment('');
      loadData();
    } catch (err) {
      setError(err.message || 'Holatni saqlashda xatolik');
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="page-title">Ishlar</h1>
          <div className="admin-subtitle">Barcha o‘quvchilarning topshirilgan ishlari</div>
        </div>
        <Button variant="ghost" size="sm" onClick={loadData}>
          <RefreshCw size={16} /> Yangilash
        </Button>
      </div>

      <div className="admin-toolbar">
        <input
          className="admin-search"
          type="search"
          placeholder="Ish nomi, havola yoki o‘quvchi..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={groupFilter} onChange={e => setGroupFilter(e.target.value)}>
          <option value="all">Barcha guruhlar</option>
          {groups.map(group => (
            <option key={group.id} value={group.id}>{group.name}</option>
          ))}
        </select>
        <select value={studentFilter} onChange={e => setStudentFilter(e.target.value)}>
          <option value="all">Barcha o‘quvchilar</option>
          {students.map(student => (
            <option key={student.id} value={student.id}>
              {student.name || student.email}
            </option>
          ))}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">Barcha holatlar</option>
          {WORK_STATUS_LIST.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {error && <div className="admin-form-error" style={{ marginBottom: 16 }}>{error}</div>}

      {filtered.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">📋</div>
          <h3>Ishlar topilmadi</h3>
          <p>
            {works.length === 0
              ? 'Hali hech bir o‘quvchi ish qo‘shmagan.'
              : 'Tanlangan filtrlar bo‘yicha ish yo‘q.'}
          </p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>O‘quvchi</th>
                <th>Guruh</th>
                <th>Ish nomi</th>
                <th>Havola</th>
                <th>Sana</th>
                <th>Holat</th>
                <th>Amal</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(work => {
                const account = accountById[String(work.studentId)];
                const group = findStudentGroup(account, groups);
                return (
                  <tr key={work.id}>
                    <td>
                      <div className="admin-row-title">{account?.name || '—'}</div>
                      <div className="muted">{account?.email || work.studentId}</div>
                      {account && isBlocked(account) && (
                        <Badge variant="danger">Bloklangan</Badge>
                      )}
                    </td>
                    <td>{group?.name || account?.groupName || '—'}</td>
                    <td>
                      <div className="admin-row-title">{work.title}</div>
                      {work.comment && <div className="muted">💬 {work.comment}</div>}
                    </td>
                    <td>
                      <a href={work.link} target="_blank" rel="noreferrer">
                        Havolani ochish
                      </a>
                    </td>
                    <td className="muted">{formatDate(work.createdAt)}</td>
                    <td>
                      <Badge variant={statusVariant(work.status)}>{work.status}</Badge>
                    </td>
                    <td>
                      <select
                        value={work.status}
                        onChange={e => handleStatusChange(work, e.target.value)}
                        style={{ minWidth: 150 }}
                      >
                        {WORK_STATUS_LIST.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {commentModal && (
        <AdminModal
          title="Qaytarish izohi"
          onClose={() => { setCommentModal(null); setComment(''); }}
          footer={
            <>
              <Button variant="ghost" onClick={() => { setCommentModal(null); setComment(''); }}>
                Bekor qilish
              </Button>
              <Button variant="accent" onClick={saveComment}>Saqlash</Button>
            </>
          }
        >
          <div className="admin-form">
            <div className="admin-field">
              <label htmlFor="work-comment">Izoh (ixtiyoriy)</label>
              <textarea
                id="work-comment"
                rows={4}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="O‘quvchiga nima to‘g‘rilash kerakligini yozing..."
              />
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
}
