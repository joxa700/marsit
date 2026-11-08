import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, UserX, Layers, ClipboardList } from 'lucide-react';
import { fetchAccounts } from '../../api/auth';
import { listGroups } from '../../services/groups';
import { WORK_STATUS, listWorks } from '../../services/works';
import { getStudents, isBlocked } from './adminUtils';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetchAccounts()
      .then(data => { if (active) setAccounts(data); })
      .catch(err => { if (active) setError(err.message || 'Xatolik'); });
    return () => { active = false; };
  }, []);

  const students = getStudents(accounts);
  const activeStudents = students.filter(student => !isBlocked(student));
  const blockedStudents = students.filter(student => isBlocked(student));
  const groups = listGroups();
  const works = listWorks();
  const pendingWorks = works.filter(work => work.status === WORK_STATUS.PENDING);

  const cards = [
    {
      id: 'total',
      icon: Users,
      tone: 'info',
      value: students.length,
      label: 'Jami o‘quvchilar',
    },
    {
      id: 'active',
      icon: UserCheck,
      tone: 'success',
      value: activeStudents.length,
      label: 'Faol o‘quvchilar',
    },
    {
      id: 'blocked',
      icon: UserX,
      tone: 'danger',
      value: blockedStudents.length,
      label: 'Bloklanganlar',
    },
    {
      id: 'groups',
      icon: Layers,
      tone: '',
      value: groups.length,
      label: 'Guruhlar soni',
    },
    {
      id: 'pending',
      icon: ClipboardList,
      tone: 'warning',
      value: pendingWorks.length,
      label: 'Tekshirilmagan ishlar',
      clickable: true,
    },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <div className="admin-subtitle">Mars IT boshqaruv paneli</div>
        </div>
      </div>

      {error && <div className="admin-form-error" style={{ marginBottom: 18 }}>{error}</div>}

      <div className="admin-stat-grid">
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className={`admin-stat-card ${card.clickable ? 'clickable' : ''}`}
              onClick={
                card.clickable
                  ? () => navigate(`/admin/works?status=${encodeURIComponent(WORK_STATUS.PENDING)}`)
                  : undefined
              }
              role={card.clickable ? 'button' : undefined}
              tabIndex={card.clickable ? 0 : undefined}
              onKeyDown={
                card.clickable
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        navigate(`/admin/works?status=${encodeURIComponent(WORK_STATUS.PENDING)}`);
                      }
                    }
                  : undefined
              }
            >
              <div className={`admin-stat-icon ${card.tone}`}>
                <Icon size={22} />
              </div>
              <div>
                <div className="admin-stat-value">{card.value}</div>
                <div className="admin-stat-label">{card.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Bo‘lim</th>
              <th>Ma’lumot</th>
              <th>Amal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="admin-row-title">O‘quvchilar</td>
              <td className="muted">{students.length} ta akkaunt</td>
              <td>
                <button className="btn btn-outline btn-sm" onClick={() => navigate('/admin/students')}>
                  Ochish
                </button>
              </td>
            </tr>
            <tr>
              <td className="admin-row-title">Guruhlar</td>
              <td className="muted">{groups.length} ta guruh</td>
              <td>
                <button className="btn btn-outline btn-sm" onClick={() => navigate('/admin/groups')}>
                  Ochish
                </button>
              </td>
            </tr>
            <tr>
              <td className="admin-row-title">Ishlar</td>
              <td className="muted">{pendingWorks.length} ta tekshiruvda</td>
              <td>
                <button className="btn btn-outline btn-sm" onClick={() => navigate('/admin/works')}>
                  Ochish
                </button>
              </td>
            </tr>
            <tr>
              <td className="admin-row-title">Kurslar</td>
              <td className="muted">Kurslar va darslar boshqaruvi</td>
              <td>
                <button className="btn btn-outline btn-sm" onClick={() => navigate('/admin/courses')}>
                  Ochish
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
