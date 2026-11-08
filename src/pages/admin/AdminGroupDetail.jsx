import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Eye, UserMinus } from 'lucide-react';
import { Button, Badge } from '../../components/ui';
import { fetchAccounts, updateAccount } from '../../api/auth';
import { getCourse } from '../../services/courses';
import {
  addStudentToGroup,
  getGroup,
  removeStudentFromGroup,
} from '../../services/groups';
import { listWorks } from '../../services/works';
import { formatDate, getStudents, isBlocked } from './adminUtils';

export default function AdminGroupDetail() {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [error, setError] = useState('');

  async function loadData() {
    setGroup(getGroup(groupId));
    try {
      setAccounts(await fetchAccounts());
    } catch (err) {
      setError(err.message || 'Akkauntlarni yuklashda xatolik');
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  const groupStudents = useMemo(() => {
    if (!group) return [];
    const ids = (group.studentIds || []).map(String);
    return getStudents(accounts).filter(account => ids.includes(String(account.id)));
  }, [group, accounts]);

  const availableStudents = useMemo(() => {
    if (!group) return [];
    const ids = (group.studentIds || []).map(String);
    return getStudents(accounts).filter(account => !ids.includes(String(account.id)));
  }, [group, accounts]);

  const works = listWorks();
  const groupWorks = useMemo(() => {
    if (!group) return [];
    const ids = (group.studentIds || []).map(String);
    return works.filter(work => ids.includes(String(work.studentId)));
  }, [group, works]);

  if (!group) {
    return (
      <div>
        <Link to="/admin/groups" className="admin-back-link">← Guruhlarga qaytish</Link>
        <div className="admin-empty">
          <div className="admin-empty-icon">🗂</div>
          <h3>Guruh topilmadi</h3>
          <p>Bu guruh o‘chirilgan yoki mavjud emas.</p>
        </div>
      </div>
    );
  }

  const course = getCourse(group.courseId);

  async function handleAddStudent() {
    if (!selectedStudent) return;
    setError('');
    try {
      addStudentToGroup(group.id, selectedStudent);
      await updateAccount(selectedStudent, {
        groupId: group.id,
        groupName: group.name,
        group: group.name,
      });
      setSelectedStudent('');
      await loadData();
    } catch (err) {
      setError(err.message || 'Studentni qo‘shishda xatolik');
    }
  }

  async function handleRemoveStudent(student) {
    if (!window.confirm(`"${student.name || student.email}" ni guruhdan chiqarmoqchimisiz?`)) return;
    setError('');
    try {
      removeStudentFromGroup(group.id, student.id);
      await updateAccount(student.id, { groupId: '', groupName: '', group: '' });
      await loadData();
    } catch (err) {
      setError(err.message || 'Studentni chiqarishda xatolik');
    }
  }

  return (
    <div>
      <Link to="/admin/groups" className="admin-back-link">← Guruhlarga qaytish</Link>

      <div className="admin-page-header">
        <div>
          <h1 className="page-title">{group.name}</h1>
          <div className="admin-subtitle">Guruh tafsilotlari</div>
        </div>
        <Badge variant="accent">{(group.studentIds || []).length} o‘quvchi</Badge>
      </div>

      {error && <div className="admin-form-error" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <div>
            <div className="admin-stat-label">Kurs</div>
            <div className="admin-stat-value" style={{ fontSize: '1rem' }}>{course?.name || '—'}</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div>
            <div className="admin-stat-label">Mentor</div>
            <div className="admin-stat-value" style={{ fontSize: '1rem' }}>{group.mentor || '—'}</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div>
            <div className="admin-stat-label">Dars kunlari</div>
            <div className="admin-stat-value" style={{ fontSize: '1rem' }}>{group.days || '—'}</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div>
            <div className="admin-stat-label">Ishlar soni</div>
            <div className="admin-stat-value">{groupWorks.length}</div>
          </div>
        </div>
      </div>

      <div className="admin-section">
        <div className="admin-page-header">
          <h2 className="section-title" style={{ marginBottom: 0 }}>O‘quvchilar</h2>
        </div>

        {groupStudents.length === 0 ? (
          <div className="admin-empty" style={{ padding: '28px 20px' }}>
            <p>Guruhda hali o‘quvchi yo‘q.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ism</th>
                  <th>Email</th>
                  <th>Yaratilgan</th>
                  <th>Holati</th>
                  <th>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {groupStudents.map(student => (
                  <tr key={student.id}>
                    <td className="admin-row-title">{student.name || '—'}</td>
                    <td>{student.email}</td>
                    <td className="muted">{formatDate(student.createdAt)}</td>
                    <td>
                      <Badge variant={isBlocked(student) ? 'danger' : 'success'}>
                        {isBlocked(student) ? 'Bloklangan' : 'Faol'}
                      </Badge>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <Link className="admin-icon-btn" to={`/admin/students/${student.id}`} title="Batafsil">
                          <Eye size={16} />
                        </Link>
                        <button
                          className="admin-icon-btn danger"
                          title="Guruhdan chiqarish"
                          onClick={() => handleRemoveStudent(student)}
                        >
                          <UserMinus size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="admin-toolbar" style={{ marginTop: 20 }}>
        <select
          value={selectedStudent}
          onChange={e => setSelectedStudent(e.target.value)}
          style={{ minWidth: 260 }}
        >
          <option value="">O‘quvchi tanlang...</option>
          {availableStudents.map(student => (
            <option key={student.id} value={student.id}>
              {student.name || student.email} ({student.email})
            </option>
          ))}
        </select>
        <Button variant="accent" onClick={handleAddStudent} disabled={!selectedStudent}>
          Guruhga qo‘shish
        </Button>
      </div>
      <div className="admin-filters-note">
        Bitta o‘quvchi faqat bitta guruhda bo‘ladi. Boshqa guruhga qo‘shilsa, eskisidan avtomatik chiqariladi.
      </div>
    </div>
  );
}
