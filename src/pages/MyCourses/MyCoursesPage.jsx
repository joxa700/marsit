// My Courses — Мои курсы
import { Card, CardBody, CardHeader, Button, ProgressBar, Badge } from '../../components/ui';
import { freeCourses, currentCourse } from '../../data/courses';
import './MyCourses.css';

const COURSE_EMOJIS = { Frontend: '⚛️', Backend: '🔧', DevOps: '🛠️' };

export default function MyCoursesPage() {
  return (
    <div>
      <h1 className="page-title">📚 Мои курсы</h1>

      {/* Continue current course */}
      <h2 className="section-title">▶ Продолжить</h2>
      <Card style={{ marginBottom: 28 }}>
        <CardBody>
          <div className="courses-current-card">
            <div
              className="courses-current-cover"
              style={{ background: `${currentCourse.coverColor}20` }}
            >
              {COURSE_EMOJIS[currentCourse.category] || '📚'}
            </div>
            <div className="courses-current-info">
              <div className="courses-current-title">{currentCourse.title}</div>
              <div className="courses-current-meta">
                📖 {currentCourse.lessonsTotal} уроков · {currentCourse.level} · {currentCourse.category}
              </div>
              <ProgressBar
                value={currentCourse.progress}
                label={`${currentCourse.lessonsDone} из ${currentCourse.lessonsTotal} уроков`}
              />
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 6 }}>
                Следующий урок: <strong>{currentCourse.nextLesson}</strong>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
              <Badge variant="accent">70%</Badge>
              <Button variant="accent">▶ Продолжить</Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Free courses */}
      <h2 className="section-title">🆓 Бесплатные курсы</h2>
      <div className="free-courses-grid">
        {freeCourses.map(course => (
          <Card key={course.id} className="course-card" hover>
            <div
              className="course-cover"
              style={{ background: `${course.coverColor}20` }}
            >
              {COURSE_EMOJIS[course.category] || '📚'}
              <div className="course-category-badge">
                <Badge variant="accent">{course.category}</Badge>
              </div>
            </div>
            <div className="course-info">
              <div className="course-title">{course.title}</div>
              <div className="course-meta">📖 {course.lessonsCount} уроков · {course.level}</div>
              <Button variant="outline" size="sm" block>
                🚀 Начать
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

