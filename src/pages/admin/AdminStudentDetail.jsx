import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, CardBody, CardHeader, Badge, ProgressBar } from '../../components/ui';
import { fetchAccounts } from '../../api/auth';
import { isAdminAccount } from '../../config/auth';
import { getCourse, getStudentEnrollments } from '../../services/courses';
import { findGroupOfStudent } from '../../services/groups';
import { listWorksByStudent } from '../../services/works';
import { formatDate, isBlocked, statusVariant } from './adminUtils';

export default function AdminStudentDetail() {
  const { studentId } = useParams();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchAccounts()
      .then(accounts => {
        if (!active) return;
        const found = accounts.find(acc => String(acc.id) === String(studentId)) || null;
        setAccount(found);
      })
      .catch(err => { if (active) setError(err.message || 'Xatolik'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [studentId]);

  if (loading) return <div className="admin-empty">Yuklanmoqda...</div>;

  if (!account) {
    return (
      <div>
        <Link to="/admin/students" className="admin-back-link">← O‘quvchilarga qaytish</Link>
        <div className="admin-empty">
          <div className="admin-empty-icon">🔍</div>
          <h3>Student topilmadi</h3>
          <p>Bu akkaunt o‘chirilgan yoki mavjud emas.</p>
        </div>
      </div>
    );
  }

  if (isAdminAccount(account)) {
    return (
      <div>
        <Link to="/admin/students" className="admin-back-link">← O‘quvchilarga qaytish</Link>
        <div className="admin-empty">
          <div className="admin-empty-icon">🛡</div>
          <h3>Admin akkaunti</h3>
          <p>Admin akkauntini tahrirlab yoki o‘chirib bo‘lmaydi.</p>
        </div>
      </div>
    );
  }

  const group = findGroupOfStudent(account.id);
  const enrollments = getStudentEnrollments(account.id);
  const courses = enrollments
    .map(enrollment => {
      const course = getCourse(enrollment.courseId);
      return course ? { ...course, progress: enrollment.progress || 0, enrollment } : null;
    })
    .filter(Boolean);
  const works = listWorksByStudent(account.id);

  return (
    <div>
      <Link to="/admin/students" className="admin-back-link">← O‘quvchilarga qaytish</Link>

      <div className="admin-page-header">
        <div>
          <h1 className="page-title">{account.name || account.email}</h1>
          <div className="admin-subtitle">Student ma’lumotlari</div>
        </div>
        <Badge variant={isBlocked(account) ? 'danger' : 'success'}>
          {isBlocked(account) ? 'Bloklangan' : 'Faol'}
        </Badge>
      </div>

      {error && <div className="admin-form-error" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="admin-detail-grid">
        <Card>
          <CardHeader><span className="card-title">Asosiy ma’lumot</span></CardHeader>
          <CardBody>
            <div className="admin-info-row">
              <span className="admin-info-label">Ism</span>
              <span className="admin-info-value">{account.name || '—'}</span>
            </div>
            <div className="admin-info-row">
              <span className="admin-info-label">Email / login</span>
              <span className="admin-info-value">{account.email}</span>
            </div>
            <div className="admin-info-row">
              <span className="admin-info-label">Guruh</span>
              <span className="admin-info-value">
                {group ? <Link to={`/admin/groups/${group.id}`}>{group.name}</Link> : 'Guruhsiz'}
              </span>
            </div>
            <div className="admin-info-row">
              <span className="admin-info-label">Yaratilgan sana</span>
              <span className="admin-info-value">{formatDate(account.createdAt)}</span>
            </div>
            <div className="admin-info-row">
              <span className="admin-info-label">Holati</span>
              <span className="admin-info-value">{isBlocked(account) ? 'Bloklangan' : 'Faol'}</span>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <span className="card-title">Kurslari</span>
            <Badge variant="accent">{courses.length} ta</Badge>
          </CardHeader>
          <CardBody>
            {courses.length === 0 ? (
              <div className="admin-empty" style={{ padding: '20px 10px', border: 'none', background: 'transparent' }}>
                <p>Hali kurs biriktirilmagan.</p>
              </div>
            ) : (
              courses.map(course => (
                <div key={course.id} style={{ marginBottom: 14 }}>
                  <div className="admin-info-row" style={{ borderBottom: 'none', paddingBottom: 4 }}>
                    <span className="admin-row-title">{course.name}</span>
                    <Badge variant="accent">{course.progress}%</Badge>
                  </div>
                  <ProgressBar value={course.progress} showPercent={false} color="#1e9bff" />
                  <div className="admin-lesson-meta" style={{ marginTop: 4 }}>
                    {course.lessons?.length || 0} dars · {course.category} · {course.level}
                  </div>
                </div>
              ))
            )}
          </CardBody>
        </Card>
      </div>

      <Card className="admin-section">
        <CardHeader>
          <span className="card-title">Ishlari</span>
          <Badge variant="warning">{works.length} ta</Badge>
        </CardHeader>
        <CardBody style={{ padding: 0 }}>
          {works.length === 0 ? (
            <div className="admin-empty" style={{ border: 'none', background: 'transparent' }}>
              <p>Hali ish qo‘shilmagan.</p>
            </div>
          ) : (
            <div className="admin-table-wrap" style={{ border: 'none', boxShadow: 'none' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ish nomi</th>
                    <th>Havola</th>
                    <th>Sana</th>
                    <th>Holat</th>
                    <th>Izoh</th>
                  </tr>
                </thead>
                <tbody>
                  {works.map(work => (
                    <tr key={work.id}>
                      <td className="admin-row-title">{work.title}</td>
                      <td>
                        <a href={work.link} target="_blank" rel="noreferrer">{work.link}</a>
                      </td>
                      <td className="muted">{formatDate(work.createdAt)}</td>
                      <td><Badge variant={statusVariant(work.status)}>{work.status}</Badge></td>
                      <td className="muted">{work.comment || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
