// Home page — Asosiy
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Badge, ProgressBar, RingProgress } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useUserStats } from '../../context/UserStatsContext';
import { getCourse, getStudentEnrollments } from '../../services/courses';
import './Home.css';

// 10 level stages
const STAGES = [
  { id: 1, label: 'Start', emoji: '🌟' },
  { id: 2, label: 'HTML',  emoji: '📄' },
  { id: 3, label: 'CSS',   emoji: '🎨' },
  { id: 4, label: 'JS',    emoji: '⚡' },
  { id: 5, label: 'React', emoji: '⚛️'  },
  { id: 6, label: 'API',   emoji: '🔌' },
  { id: 7, label: 'Git',   emoji: '🗂️'  },
  { id: 8, label: 'TS',    emoji: '🔷' },
  { id: 9, label: 'Pro',   emoji: '👑' },
  { id: 10, label: 'Mars', emoji: '🚀' },
];

export default function HomePage() {
  const { user } = useAuth();
  const { stats } = useUserStats();

  const currentStage = Math.min(10, Math.max(1, Number(stats.level) || 1));
  const levelProgress = Math.round(((currentStage - 1) / 10) * 100);

  const enrollments = user ? getStudentEnrollments(user.id) : [];
  const myCourses = enrollments
    .map(enrollment => {
      const course = getCourse(enrollment.courseId);
      return course ? { ...course, progress: enrollment.progress || 0, enrollment } : null;
    })
    .filter(Boolean);
  const activeCourse = myCourses[0] || null;

  return (
    <div>
      <h1 className="page-title">Asosiy</h1>

      <div className="home-grid">
        {/* ===== LEFT (WIDE) COLUMN ===== */}
        <div className="home-left">
          {/* 1. Darajangiz Level Card */}
          <Card>
            <CardHeader>
              <span className="card-title">Darajangiz</span>
              <Badge variant="accent">{currentStage}-daraja</Badge>
            </CardHeader>
            <CardBody>
              <div className="level-stages">
                {STAGES.map((stage, i) => {
                  const status = i + 1 < currentStage ? 'done'
                               : i + 1 === currentStage ? 'current'
                               : 'locked';
                  return (
                    <div key={stage.id} style={{ display: 'flex', alignItems: 'center' }}>
                      {i > 0 && (
                        <div className={['stage-connector', i + 1 <= currentStage ? 'done' : ''].join(' ')} />
                      )}
                      <div className={['stage-node', status].join(' ')} title={stage.label}>
                        <span style={{ fontSize: '1rem' }}>{stage.emoji}</span>
                        <span className="stage-label">{stage.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 28 }}>
                <ProgressBar
                  value={levelProgress}
                  max={100}
                  label="Daraja progressi"
                  color="#f04a12"
                />
              </div>
            </CardBody>
          </Card>

          {/* 2. Mars Code Promo Banner */}
          <div className="promo-banner">
            <div className="promo-code-box">
              <div className="promo-code-header">
                <span className="promo-code-dot dot-red" />
                <span className="promo-code-dot dot-yellow" />
                <span className="promo-code-dot dot-green" />
              </div>
              <pre className="promo-code-body">
                <code>
                  <span className="code-kw">const</span> coder = <span className="code-fn">learnAtMars</span>();{'\n'}
                  coder.<span className="code-method">levelUp</span>(<span className="code-str">'Senior'</span>);{'\n'}
                  <span className="code-kw">return</span> coder.<span className="code-prop">isReady</span>;
                </code>
              </pre>
            </div>

            <div className="promo-content">
              <span className="promo-badge">YANGI</span>
              <h3 className="promo-title">Mars Code</h3>
              <p className="promo-desc">Marsda 6 oy ichida Senior Dasturchi darajasiga ko'tariling!</p>
              <button
                type="button"
                className="promo-btn"
                onClick={() => alert('Mars Code dasturiga xush kelibsiz!')}
              >
                Sinab ko'rish →
              </button>
            </div>
          </div>

          {/* 3. Kurslarim Course Card */}
          <Card>
            <CardHeader>
              <span className="card-title">Kurslarim</span>
              {activeCourse && <Badge variant="accent">{activeCourse.category}</Badge>}
            </CardHeader>
            <CardBody>
              {activeCourse ? (
                <div className="course-horizontal-card">
                  <div className="course-ring-wrap">
                    <RingProgress value={activeCourse.progress} size={84} strokeWidth={8} color="#1e9bff">
                      {activeCourse.progress}%
                    </RingProgress>
                  </div>

                  <div className="course-middle-info">
                    <div className="course-title-text">{activeCourse.name}</div>
                    <div className="course-sub-text">
                      Keyingi mavzu: {activeCourse.lessons?.[0]?.title || "Darslar hali qo'shilmagan"}
                    </div>
                    <div className="course-progress-bar-wrap">
                      <ProgressBar value={activeCourse.progress} color="#1e9bff" showPercent={false} />
                    </div>
                  </div>

                  <div className="course-right-actions">
                    <div className="course-stats-horizontal">
                      <div className="course-stat">
                        <span className="course-stat-val">{activeCourse.enrollment?.completedLessons?.length || 0}</span>
                        <span className="course-stat-label">bajarildi</span>
                      </div>
                      <div className="course-stat-divider" />
                      <div className="course-stat">
                        <span className="course-stat-val">{activeCourse.lessons?.length || 0}</span>
                        <span className="course-stat-label">dars</span>
                      </div>
                    </div>
                    <Link to="/courses" className="course-davom-link">
                      Davom etish &gt;
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="home-empty-state">
                  <div className="home-empty-icon">📚</div>
                  <div className="home-empty-title">Hali kurs yo'q</div>
                  <div className="home-empty-text">
                    Guruhga kurs biriktirilganda kurslar shu yerda paydo bo'ladi.
                  </div>
                  <Link to="/courses" className="course-davom-link">Kurslarim &gt;</Link>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* ===== RIGHT (NARROW) COLUMN ===== */}
        <div className="home-right">
          <Card className="tasks-card">
            <CardHeader>
              <div className="tasks-header-left">
                <span className="card-title">Topshiriqlar</span>
                <Badge variant="warning">0 ta faol</Badge>
              </div>
              <Link to="/works" className="tasks-all-link">
                Barchasi &gt;
              </Link>
            </CardHeader>
            <CardBody>
              <div className="home-empty-state">
                <div className="home-empty-icon">📝</div>
                <div className="home-empty-title">Hali topshiriq yo'q</div>
                <div className="home-empty-text">
                  Topshiriqlar paydo bo'lganda shu yerda ko'rinadi.
                </div>
                <Link to="/works" className="course-davom-link">Ish qo'shish &gt;</Link>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
