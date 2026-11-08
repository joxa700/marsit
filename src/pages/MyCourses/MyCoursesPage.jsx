// My Courses — Kurslarim
import { Card, CardBody, CardHeader, Button, ProgressBar, Badge } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { getCourse, getStudentEnrollments } from '../../services/courses';
import './MyCourses.css';

const COURSE_EMOJIS = { Frontend: '⚛️', Backend: '🔧', DevOps: '🛠️' };

export default function MyCoursesPage() {
  const { user } = useAuth();

  const enrollments = user ? getStudentEnrollments(user.id) : [];
  const myCourses = enrollments
    .map(enrollment => {
      const course = getCourse(enrollment.courseId);
      return course ? { ...course, progress: enrollment.progress || 0, enrollment } : null;
    })
    .filter(Boolean);

  return (
    <div>
      <h1 className="page-title">📚 Kurslarim</h1>

      {myCourses.length === 0 ? (
        <Card>
          <CardBody>
            <div className="courses-empty-state">
              <div className="courses-empty-icon">🪐</div>
              <h3 className="courses-empty-title">Hali kurs yo'q</h3>
              <p className="courses-empty-text">
                Guruhga kurs biriktirilganda u shu yerda 0% progress bilan paydo bo'ladi.
              </p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <>
          <h2 className="section-title">▶ Sizning kurslaringiz</h2>
          <div className="free-courses-grid">
            {myCourses.map(course => (
              <Card key={course.id} className="course-card" hover>
                <CardHeader>
                  <span className="card-title">{course.name}</span>
                  <Badge variant="accent">{course.category}</Badge>
                </CardHeader>
                <CardBody>
                  <div className="course-cover" style={{ background: 'var(--accent-light)' }}>
                    {COURSE_EMOJIS[course.category] || '📚'}
                  </div>
                  <div className="course-meta" style={{ marginTop: 12 }}>
                    📖 {course.lessons?.length || 0} dars · {course.level}
                  </div>
                  <ProgressBar
                    value={course.progress}
                    label={`${course.enrollment?.completedLessons?.length || 0} / ${course.lessons?.length || 0} dars`}
                    color="#1e9bff"
                  />
                  <div style={{ marginTop: 12 }}>
                    <Button variant="outline" size="sm" block>
                      ▶ Davom etish
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
