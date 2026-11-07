// Home page — Asosiy
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Button, ProgressBar, RingProgress, Badge } from '../../components/ui';
import { currentCourse } from '../../data/courses';
import { currentTasks } from '../../data/tasks';
import { useUserStats } from '../../context/UserStatsContext';
import './Home.css';

// 10 level stages (stage 6 = current)
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
const CURRENT_STAGE = 6; // 1-indexed

const STATUS_LABEL = { pending: 'Kutilmoqda', done: 'Bajarildi', 'in-progress': 'Jarayonda' };

export default function HomePage() {
  const { addCoins, addLightning } = useUserStats();

  function completeTask(task) {
    if (task.status !== 'done') {
      addCoins(task.coins);
      addLightning(5);
    }
  }

  return (
    <div>
      <h1 className="page-title">Asosiy</h1>

      <div className="home-grid">
        {/* ===== LEFT (WIDE) COLUMN ===== */}
        {/* Order: 1. Darajangiz, 2. Mars Code, 3. Kurslarim */}
        <div className="home-left">
          {/* 1. Darajangiz Level Card (unchanged) */}
          <Card>
            <CardHeader>
              <span className="card-title">Darajangiz</span>
              <Badge variant="accent">6-daraja</Badge>
            </CardHeader>
            <CardBody>
              <div className="level-stages">
                {STAGES.map((stage, i) => {
                  const status = i + 1 < CURRENT_STAGE ? 'done'
                               : i + 1 === CURRENT_STAGE ? 'current'
                               : 'locked';
                  return (
                    <div key={stage.id} style={{ display: 'flex', alignItems: 'center' }}>
                      {i > 0 && (
                        <div className={['stage-connector', i + 1 <= CURRENT_STAGE ? 'done' : ''].join(' ')} />
                      )}
                      <div
                        className={['stage-node', status].join(' ')}
                        title={stage.label}
                      >
                        <span style={{ fontSize: '1rem' }}>{stage.emoji}</span>
                        <span className="stage-label">{stage.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 28 }}>
                <ProgressBar
                  value={CURRENT_STAGE}
                  max={10}
                  label="Daraja progressi"
                  color="#f04a12"
                />
              </div>
            </CardBody>
          </Card>

          {/* 2. Mars Code Promo Banner (horizontal layout, under level card) */}
          <div className="promo-banner">
            {/* Left: Code-snippet box */}
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

            {/* Right/center: Text description and button */}
            <div className="promo-content">
              <span className="promo-badge">YANGI</span>
              <h3 className="promo-title">Mars Code</h3>
              <p className="promo-desc">Marsda 6 oy ichida Senior Dasturchi darajasiga ko'tariling!</p>
              <button
                type="button"
                className="promo-btn"
                onClick={() => alert("Mars Code dasturiga xush kelibsiz!")}
              >
                Sinab ko'rish →
              </button>
            </div>
          </div>

          {/* 3. Kurslarim Course Card (horizontal layout, under Mars Code banner) */}
          <Card>
            <CardHeader>
              <span className="card-title">Kurslarim</span>
              <Badge variant="accent">{currentCourse.category}</Badge>
            </CardHeader>
            <CardBody>
              <div className="course-horizontal-card">
                {/* Left: Circular progress ring */}
                <div className="course-ring-wrap">
                  <RingProgress value={currentCourse.progress} size={84} strokeWidth={8} color="#1e9bff">
                    {currentCourse.progress}%
                  </RingProgress>
                </div>

                {/* Middle: Course name and info */}
                <div className="course-middle-info">
                  <div className="course-title-text">{currentCourse.title}</div>
                  <div className="course-sub-text">Keyingi mavzu: {currentCourse.nextLesson}</div>
                  <div className="course-progress-bar-wrap">
                    <ProgressBar value={currentCourse.progress} color="#1e9bff" showPercent={false} />
                  </div>
                </div>

                {/* Right: Stats and Davom etish link */}
                <div className="course-right-actions">
                  <div className="course-stats-horizontal">
                    <div className="course-stat">
                      <span className="course-stat-val">{currentCourse.lessonsDone}</span>
                      <span className="course-stat-label">bajarildi</span>
                    </div>
                    <div className="course-stat-divider" />
                    <div className="course-stat">
                      <span className="course-stat-val">{currentCourse.lessonsLeft}</span>
                      <span className="course-stat-label">dars</span>
                    </div>
                  </div>
                  <Link to="/courses" className="course-davom-link">
                    Davom etish &gt;
                  </Link>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* ===== RIGHT (NARROW) COLUMN ===== */}
        {/* Only Topshiriqlar (tasks) card with its Barchasi > link */}
        <div className="home-right">
          <Card className="tasks-card">
            <CardHeader>
              <div className="tasks-header-left">
                <span className="card-title">Topshiriqlar</span>
                <Badge variant="warning">{currentTasks.filter(t => t.status !== 'done').length} ta faol</Badge>
              </div>
              <Link to="/works" className="tasks-all-link">
                Barchasi &gt;
              </Link>
            </CardHeader>
            <CardBody>
              <div className="tasks-list tasks-scrollable">
                {currentTasks.map(task => (
                  <div key={task.id} className="task-item">
                    <div className={['task-status-dot', task.status].join(' ')} />
                    <div className="task-info">
                      <div className="task-title">{task.title}</div>
                      <div className="task-deadline">📅 gacha {task.deadline}</div>
                    </div>
                    <span className="task-coins">+{task.coins} 🪙</span>
                    <Badge
                      variant={task.status === 'done' ? 'success' : task.status === 'in-progress' ? 'accent' : 'warning'}
                    >
                      {STATUS_LABEL[task.status]}
                    </Badge>
                    {task.status !== 'done' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => completeTask(task)}
                      >
                        ✓
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

