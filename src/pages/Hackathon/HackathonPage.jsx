// Hackathon page — Хакатон
import { useState } from 'react';
import { Card, CardBody, CardHeader, Tabs, Button, Badge, Avatar } from '../../components/ui';
import { hackathonSteps, hackathonTeam, hackathonTeams, hackathonTopics, hackathonGallery } from '../../data/hackathon';
import { useUserStats } from '../../context/UserStatsContext';
import './Hackathon.css';

const TABS = [
  { id: 'main',        label: 'Главная' },
  { id: 'prep',        label: 'Подготовка' },
  { id: 'myteam',      label: 'Моя команда' },
  { id: 'teams',       label: 'Команды' },
  { id: 'topics',      label: 'Темы' },
  { id: 'submit',      label: 'Сдача работы' },
  { id: 'gallery',     label: 'Галерея' },
  { id: 'results',     label: 'Результаты' },
];

export default function HackathonPage() {
  const [activeTab, setActiveTab] = useState('main');
  const [topics, setTopics] = useState(hackathonTopics);
  const [selectedTopic, setSelectedTopic] = useState('Марсианский туризм');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitForm, setSubmitForm] = useState({ projectTitle: '', repoUrl: '', demoUrl: '', notes: '' });
  const { addCoins, addLightning } = useUserStats();

  const handleSelectTopic = (title) => {
    setSelectedTopic(title);
    setTopics(prev => prev.map(t => ({
      ...t,
      taken: t.title === title ? true : t.taken
    })));
  };

  const handleStepAction = (stepId) => {
    if (stepId === 1) setActiveTab('myteam');
    else if (stepId === 2) setActiveTab('topics');
    else if (stepId === 3) setActiveTab('submit');
  };

  const handleSubmitWork = (e) => {
    e.preventDefault();
    if (!submitForm.projectTitle || !submitForm.repoUrl) return;
    setSubmitSuccess(true);
    addCoins(100);
    addLightning(25);
  };

  return (
    <div>
      <h1 className="page-title">🚀 Хакатон Mars IT</h1>

      {/* Tabs */}
      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {/* TAB: Главная */}
      {activeTab === 'main' && (
        <div>
          {/* Hero Banner */}
          <div className="hackathon-hero">
            <h2>Mars Hack 2026: Mission to Mars</h2>
            <p>
              48-часовой интенсивный командный хакатон по веб-разработке и космическим технологиям.
              Создайте реальный прототип и получите призовой фонд 10 000 000 сум!
            </p>
            <div className="hackathon-countdown">
              <div className="countdown-box">
                <div className="countdown-num">02</div>
                <div className="countdown-lbl">Дня</div>
              </div>
              <div className="countdown-box">
                <div className="countdown-num">14</div>
                <div className="countdown-lbl">Часов</div>
              </div>
              <div className="countdown-box">
                <div className="countdown-num">35</div>
                <div className="countdown-lbl">Минут</div>
              </div>
              <div className="countdown-box">
                <div className="countdown-num">48</div>
                <div className="countdown-lbl">Секунд</div>
              </div>
            </div>
          </div>

          {/* Section: Что нужно сделать */}
          <div className="steps-section">
            <h2 className="section-title">📋 Что нужно сделать</h2>
            <div className="steps-grid">
              {hackathonSteps.map(step => (
                <div key={step.id} className={['step-card', step.status].join(' ')}>
                  <div>
                    <div className="step-header">
                      <div className="step-icon-wrap">{step.icon}</div>
                      <div>
                        <div className="step-num">Шаг {step.id}</div>
                        <div className="step-title">{step.title}</div>
                      </div>
                    </div>
                    <p className="step-desc" style={{ marginTop: 12 }}>{step.description}</p>
                  </div>
                  <div className="step-footer">
                    <Badge
                      variant={step.status === 'done' ? 'success' : step.status === 'in-progress' ? 'accent' : 'muted'}
                    >
                      {step.status === 'done' ? '✓ Выполнено' : step.status === 'in-progress' ? 'В процессе' : '🔒 Заблокировано'}
                    </Badge>
                    <Button
                      variant={step.status === 'done' ? 'outline' : 'accent'}
                      size="sm"
                      onClick={() => handleStepAction(step.id)}
                    >
                      {step.action}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick info row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 24 }}>
            <Card>
              <CardBody style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: 6 }}>🏆</div>
                <div style={{ fontWeight: 700 }}>Призовой фонд</div>
                <div style={{ color: 'var(--accent)', fontSize: '1.2rem', fontWeight: 800, marginTop: 4 }}>10 000 000 сум</div>
              </CardBody>
            </Card>
            <Card>
              <CardBody style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: 6 }}>👥</div>
                <div style={{ fontWeight: 700 }}>Участников</div>
                <div style={{ color: 'var(--accent)', fontSize: '1.2rem', fontWeight: 800, marginTop: 4 }}>48 команд</div>
              </CardBody>
            </Card>
            <Card>
              <CardBody style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: 6 }}>🎖️</div>
                <div style={{ fontWeight: 700 }}>Жюри</div>
                <div style={{ color: 'var(--accent)', fontSize: '1.2rem', fontWeight: 800, marginTop: 4 }}>Senior инженеры IT</div>
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {/* TAB: Подготовка */}
      {activeTab === 'prep' && (
        <Card>
          <CardHeader>
            <span className="card-title">📚 Материалы и чек-лист подготовки</span>
          </CardHeader>
          <CardBody>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
              Чтобы победить на хакатоне, повторите следующие темы и настройте рабочее окружение:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { title: 'Шаблон проекта на Vite + React', done: true },
                { title: 'Основы Git flow и ветвление в команде', done: true },
                { title: 'Работа с REST API и WebSocket на клиенте', done: false },
                { title: 'Деплой на Vercel / GitHub Pages', done: false },
                { title: 'Подготовка 3-минутной презентации проекта', done: false },
              ].map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  background: 'var(--bg-hover)',
                  borderRadius: 'var(--border-radius-sm)'
                }}>
                  <span style={{ fontSize: '1.2rem' }}>{item.done ? '✅' : '⬜'}</span>
                  <span style={{ flex: 1, fontWeight: 500 }}>{item.title}</span>
                  <Badge variant={item.done ? 'success' : 'muted'}>
                    {item.done ? 'Готово' : 'В планах'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* TAB: Моя команда */}
      {activeTab === 'myteam' && (
        <div>
          <Card style={{ marginBottom: 20 }}>
            <CardHeader>
              <span className="card-title">🛡️ Название команды: {hackathonTeam.name}</span>
              <Badge variant="success">Готова к бою</Badge>
            </CardHeader>
            <CardBody>
              <div className="team-member-list">
                {hackathonTeam.members.map(member => (
                  <div key={member.id} className="team-member-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Avatar name={member.name} size="md" />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{member.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Роль: {member.role}</div>
                      </div>
                    </div>
                    <Badge variant="accent">{member.role}</Badge>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
                <Button variant="accent" size="sm">+ Пригласить участника</Button>
                <Button variant="outline" size="sm">⚙️ Редактировать команду</Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* TAB: Команды */}
      {activeTab === 'teams' && (
        <Card>
          <CardHeader>
            <span className="card-title">👥 Зарегистрированные команды</span>
          </CardHeader>
          <CardBody style={{ padding: 0 }}>
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Команда</th>
                  <th>Участники</th>
                  <th>Тема</th>
                  <th>Баллы</th>
                </tr>
              </thead>
              <tbody>
                {hackathonTeams.map(t => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 700 }}>{t.name}</td>
                    <td>{t.members} чел.</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{t.topic}</td>
                    <td style={{ fontWeight: 700, color: 'var(--accent)' }}>{t.score > 0 ? `${t.score} pts` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      )}

      {/* TAB: Темы */}
      {activeTab === 'topics' && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <p style={{ color: 'var(--text-secondary)' }}>
              Текущая выбранная тема: <strong style={{ color: 'var(--accent)' }}>{selectedTopic || 'Не выбрана'}</strong>
            </p>
          </div>
          <div className="topics-grid">
            {topics.map(topic => (
              <div key={topic.id} className="topic-card">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Badge variant={topic.difficulty === 'Лёгкий' ? 'success' : topic.difficulty === 'Средний' ? 'warning' : 'danger'}>
                      {topic.difficulty}
                    </Badge>
                    {topic.title === selectedTopic && <Badge variant="accent">Ваш выбор</Badge>}
                  </div>
                  <h3 style={{ fontSize: '1rem', marginTop: 6 }}>{topic.title}</h3>
                </div>
                <Button
                  variant={topic.title === selectedTopic ? 'outline' : 'accent'}
                  size="sm"
                  onClick={() => handleSelectTopic(topic.title)}
                >
                  {topic.title === selectedTopic ? '✓ Выбрано' : 'Выбрать тему'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Сдача работы */}
      {activeTab === 'submit' && (
        <div>
          {submitSuccess ? (
            <Card>
              <CardBody style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎉</div>
                <h2>Работа успешно отправлена на проверку!</h2>
                <p style={{ color: 'var(--text-secondary)', margin: '10px 0 20px' }}>
                  Вы получили +100 монет и +25 молний за сдачу проекта. Жюри оценит работу в день подведения итогов.
                </p>
                <Button variant="accent" onClick={() => setSubmitSuccess(false)}>
                  Изменить ссылку / повторно отправить
                </Button>
              </CardBody>
            </Card>
          ) : (
            <form className="submit-form" onSubmit={handleSubmitWork}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: 4 }}>📤 Сдача проекта</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 12 }}>
                Укажите название проекта, репозиторий GitHub и ссылку на рабочий деплой.
              </p>

              <div className="form-group">
                <label className="form-label">Название проекта *</label>
                <input
                  required
                  placeholder="Например, Mars Rover Tracker"
                  value={submitForm.projectTitle}
                  onChange={e => setSubmitForm({ ...submitForm, projectTitle: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ссылка на GitHub репозиторий *</label>
                <input
                  required
                  type="url"
                  placeholder="https://github.com/..."
                  value={submitForm.repoUrl}
                  onChange={e => setSubmitForm({ ...submitForm, repoUrl: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Демо / Деплой (Vercel, Netlify)</label>
                <input
                  type="url"
                  placeholder="https://my-mars-app.vercel.app"
                  value={submitForm.demoUrl}
                  onChange={e => setSubmitForm({ ...submitForm, demoUrl: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Комментарии для жюри</label>
                <textarea
                  rows="3"
                  placeholder="Особенности проекта, логины для теста..."
                  value={submitForm.notes}
                  onChange={e => setSubmitForm({ ...submitForm, notes: e.target.value })}
                />
              </div>

              <Button type="submit" variant="accent" size="lg" style={{ marginTop: 8 }}>
                🚀 Отправить работу на жюри
              </Button>
            </form>
          )}
        </div>
      )}

      {/* TAB: Галерея */}
      {activeTab === 'gallery' && (
        <div className="gallery-grid">
          {hackathonGallery.map(item => (
            <div key={item.id} className="gallery-card">
              <div className="gallery-preview" style={{ background: item.color }}>
                🪐
              </div>
              <div className="gallery-body">
                <Badge variant="accent" style={{ marginBottom: 6 }}>Команда {item.team}</Badge>
                <h3 style={{ fontSize: '1rem', marginTop: 4 }}>{item.title}</h3>
                <Button variant="outline" size="sm" block style={{ marginTop: 12 }}>
                  Смотреть презентацию
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB: Результаты */}
      {activeTab === 'results' && (
        <Card>
          <CardHeader>
            <span className="card-title">🏆 Результаты предыдущего сезона: Mars Hack 2025</span>
          </CardHeader>
          <CardBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { place: '🥇 1 Место', team: 'Cosmo Coders', prize: '5 000 000 сум', project: 'Mars Telemetry Dashboard' },
                { place: '🥈 2 Место', team: 'Red Planet Devs', prize: '3 000 000 сум', project: 'Oxygen Allocation AI' },
                { place: '🥉 3 Место', team: 'Astro Frontends', prize: '2 000 000 сум', project: 'Martian Greenhouse Monitor' },
              ].map((res, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 18px',
                  background: 'var(--bg-hover)',
                  borderRadius: 'var(--border-radius-sm)',
                  flexWrap: 'wrap',
                  gap: 10
                }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem' }}>{res.place}: {res.team}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Проект: {res.project}</div>
                  </div>
                  <Badge variant="warning">{res.prize}</Badge>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

