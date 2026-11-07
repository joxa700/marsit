// My Works — Мои работы
import { useState } from 'react';
import { Card, CardBody, Tabs, ProgressBar, Button, Badge } from '../../components/ui';
import { myWorksRevision, myWorksReview, portfolioItems, fileItems } from '../../data/tasks';
import './MyWorks.css';

const TABS = [
  { id: 'works',     label: 'Мои работы' },
  { id: 'portfolio', label: 'Портфолио' },
  { id: 'plan',      label: 'Весь план' },
  { id: 'files',     label: 'Файлы' },
  { id: 'drive',     label: 'Мой диск' },
];

export default function MyWorksPage() {
  const [activeTab, setActiveTab] = useState('works');

  return (
    <div>
      <h1 className="page-title">📋 Мои работы</h1>

      {/* Tabs */}
      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {/* Course overall progress: 33/132 */}
      <Card style={{ marginBottom: 24 }}>
        <CardBody>
          <div className="works-progress-banner">
            <div className="works-progress-info">
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>
                Общий прогресс курса
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
                33 из 132 заданий выполнено
              </div>
              <ProgressBar value={33} max={132} />
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent)' }}>
                33 / 132
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>25% пройдено</div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* TAB: Мои работы */}
      {activeTab === 'works' && (
        <div>
          {/* Вернули на доработку */}
          <div className="works-group">
            <div className="works-group-header">
              <span className="works-group-title">🔄 Вернули на доработку</span>
              <Badge variant="danger">{myWorksRevision.length}</Badge>
            </div>
            <div className="works-list">
              {myWorksRevision.map(item => (
                <div key={item.id} className="work-item">
                  <div className="work-item-main">
                    <span className="work-item-num">{item.number}</span>
                    <div>
                      <div className="work-item-title">{item.title}</div>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: '0.75rem' }}
                      >
                        🔗 {item.link}
                      </a>
                    </div>
                  </div>
                  <span className="work-item-date">📅 {item.date}</span>
                  <Button variant="outline" size="sm">
                    📖 К уроку
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* На проверке */}
          <div className="works-group">
            <div className="works-group-header">
              <span className="works-group-title">⏳ На проверке</span>
              <Badge variant="warning">{myWorksReview.length}</Badge>
            </div>
            <div className="works-list">
              {myWorksReview.map(item => (
                <div key={item.id} className="work-item">
                  <div className="work-item-main">
                    <span className="work-item-num">{item.number}</span>
                    <div>
                      <div className="work-item-title">{item.title}</div>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: '0.75rem' }}
                      >
                        🔗 {item.link}
                      </a>
                    </div>
                  </div>
                  <span className="work-item-date">📅 {item.date}</span>
                  <Button variant="outline" size="sm">
                    📖 К уроку
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: Портфолио */}
      {activeTab === 'portfolio' && (
        <div>
          <div className="portfolio-grid">
            {portfolioItems.map(item => (
              <Card key={item.id} className="portfolio-card" hover>
                <CardBody>
                  <div
                    className="portfolio-thumb"
                    style={{ background: `${item.color}20` }}
                  >
                    💼
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>
                    {item.title}
                  </div>
                  <Badge variant="accent">{item.tech}</Badge>
                  <Button variant="outline" size="sm" block style={{ marginTop: 10 }}>
                    Посмотреть
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Весь план */}
      {activeTab === 'plan' && (
        <Card>
          <CardBody>
            <h3 style={{ marginBottom: 12 }}>Учебный план: React.js Developer</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Модуль 1: Основы Web & HTML/CSS (выполнен)',
                'Модуль 2: JavaScript Basic & ES6+ (выполнен)',
                'Модуль 3: React Основы: компоненты, props, state (в процессе)',
                'Модуль 4: React Hooks & Роутинг (в процессе)',
                'Модуль 5: State Management & Redux (заблокирован)',
                'Модуль 6: Дипломный проект (заблокирован)'
              ].map((m, i) => (
                <div
                  key={i}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: i < 2 ? 'rgba(16,185,129,.1)' : i < 4 ? 'rgba(99,102,241,.1)' : 'var(--bg-hover)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                >
                  {i < 2 ? '✅ ' : i < 4 ? '🔄 ' : '🔒 '}{m}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* TAB: Файлы */}
      {activeTab === 'files' && (
        <div className="files-list">
          {fileItems.map(f => (
            <div key={f.id} className="file-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '1.4rem' }}>📁</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{f.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {f.size} · {f.date}
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                ⬇ Скачать
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* TAB: Мой диск */}
      {activeTab === 'drive' && (
        <Card>
          <CardBody style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>☁️</div>
            <h3>Mars Cloud Drive</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '8px 0 16px' }}>
              Использовано 1.2 ГБ из 15 ГБ
            </p>
            <ProgressBar value={1.2} max={15} />
            <Button variant="accent" style={{ marginTop: 20 }}>
              📤 Загрузить файл
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

