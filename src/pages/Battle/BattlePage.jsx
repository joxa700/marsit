// Battle page
import { useState } from 'react';
import { Card, CardBody, Tabs, Button, Badge } from '../../components/ui';
import { leaderboard, opponents, emotions, battleQuizQuestions } from '../../data/battles';
import { useUserStats } from '../../context/UserStatsContext';
import { useAuth } from '../../context/AuthContext';
import './Battle.css';

const TABS = [
  { id: 'battle',    label: 'BATTLE' },
  { id: 'rating',    label: 'РЕЙТИНГ' },
  { id: 'rivals',    label: 'СОПЕРНИКИ' },
  { id: 'emotions',  label: 'ЭМОЦИИ' },
];

export default function BattlePage() {
  const { user } = useAuth();
  const { stats, addLightning, addCoins, incrementStreak } = useUserStats();
  const [activeTab, setActiveTab] = useState('battle');

  // Matchmaking state
  const [searching, setSearching] = useState(false);
  const [opponent, setOpponent] = useState(null);

  // Bot Quiz state
  const [quizActive, setQuizActive] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizSelected, setQuizSelected] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Selected battle emotion
  const [sentEmoji, setSentEmoji] = useState(null);

  // Search opponent
  function handleFindOpponent() {
    setSearching(true);
    setOpponent(null);
    setTimeout(() => {
      const found = opponents[Math.floor(Math.random() * opponents.length)];
      setOpponent(found);
      setSearching(false);
    }, 2000);
  }

  // Start bot training
  function handleStartBotQuiz() {
    setQuizActive(true);
    setQuizIdx(0);
    setQuizSelected(null);
    setQuizScore(0);
    setQuizFinished(false);
    setOpponent({ name: 'Mars Bot 🤖', level: 'Бот', wins: 99, lightning: 500 });
  }

  // Answer quiz question
  function handleAnswer(optIdx) {
    if (quizSelected !== null) return;
    setQuizSelected(optIdx);
    const q = battleQuizQuestions[quizIdx];
    const isCorrect = optIdx === q.correct;
    if (isCorrect) {
      setQuizScore(s => s + 1);
      addLightning(10);
      addCoins(15);
    }
    setTimeout(() => {
      if (quizIdx + 1 < battleQuizQuestions.length) {
        setQuizIdx(i => i + 1);
        setQuizSelected(null);
      } else {
        setQuizFinished(true);
        incrementStreak();
      }
    }, 1000);
  }

  return (
    <div>
      <h1 className="page-title">⚔️ Battle</h1>

      {/* Tabs */}
      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {/* Stats row */}
      <div className="battle-stats-row">
        <div className="battle-stat-card">
          <span className="battle-stat-icon">⚡</span>
          <div>
            <div className="battle-stat-val">{stats.lightning}</div>
            <div className="battle-stat-lbl">Молнии</div>
          </div>
        </div>
        <div className="battle-stat-card">
          <span className="battle-stat-icon">🔥</span>
          <div>
            <div className="battle-stat-val">{stats.streak}</div>
            <div className="battle-stat-lbl">Стрик дней</div>
          </div>
        </div>
        <div className="battle-stat-card">
          <span className="battle-stat-icon">🏆</span>
          <div>
            <div className="battle-stat-val">{stats.wins}</div>
            <div className="battle-stat-lbl">Побед</div>
          </div>
        </div>
      </div>

      {/* TAB: BATTLE */}
      {activeTab === 'battle' && (
        <Card>
          <CardBody>
            {/* Matchup arena */}
            <div className="battle-matchup">
              {/* Player slot */}
              <div className="matchup-slot filled">
                <div className="matchup-avatar-wrap">
                  🧑‍💻
                  {sentEmoji && (
                    <span style={{ position: 'absolute', top: -10, right: -10, fontSize: '1.5rem', animation: 'fadeIn 0.2s' }}>
                      {sentEmoji}
                    </span>
                  )}
                </div>
                <div className="matchup-name">{user?.name || 'Вы'}</div>
                <div className="matchup-sub">⚡ {stats.lightning} молний</div>
              </div>

              {/* VS */}
              <div className="matchup-vs">VS</div>

              {/* Opponent slot */}
              <div className={['matchup-slot', opponent ? 'filled found' : ''].join(' ')}>
                <div className="matchup-avatar-wrap">
                  {searching ? (
                    <span className="animate-spin" style={{ fontSize: '1.8rem' }}>🔄</span>
                  ) : opponent ? (
                    '👤'
                  ) : (
                    '❓'
                  )}
                </div>
                <div className="matchup-name">
                  {searching ? 'Поиск...' : opponent ? opponent.name : 'Выбрать'}
                </div>
                <div className="matchup-sub">
                  {opponent ? `⚡ ${opponent.lightning} молний` : 'Соперник'}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            {!quizActive && (
              <div className="battle-actions">
                <Button
                  variant="accent"
                  size="lg"
                  disabled={searching}
                  onClick={handleFindOpponent}
                >
                  {searching ? '🔍 Поиск соперника...' : '⚔️ Найти соперника'}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleStartBotQuiz}
                >
                  🤖 Тренировка с ботом
                </Button>
              </div>
            )}

            {/* Quiz mode against Bot */}
            {quizActive && (
              <div className="quiz-box">
                {!quizFinished ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span style={{ fontWeight: 700 }}>
                        Вопрос {quizIdx + 1} из {battleQuizQuestions.length}
                      </span>
                      <Badge variant="accent">Счёт: {quizScore}</Badge>
                    </div>
                    <h3 style={{ marginBottom: 16 }}>
                      {battleQuizQuestions[quizIdx].q}
                    </h3>
                    <div className="quiz-options">
                      {battleQuizQuestions[quizIdx].options.map((opt, i) => {
                        let cls = 'quiz-opt-btn';
                        if (quizSelected !== null) {
                          if (i === battleQuizQuestions[quizIdx].correct) cls += ' correct';
                          else if (i === quizSelected) cls += ' wrong';
                        }
                        return (
                          <button
                            key={i}
                            className={cls}
                            disabled={quizSelected !== null}
                            onClick={() => handleAnswer(i)}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '16px 0' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 8 }}>
                      {quizScore >= 3 ? '🎉' : '💪'}
                    </div>
                    <h3>{quizScore >= 3 ? 'Победа!' : 'Хорошая тренировка!'}</h3>
                    <p style={{ color: 'var(--text-secondary)', margin: '8px 0 16px' }}>
                      Вы ответили правильно на {quizScore} из {battleQuizQuestions.length} вопросов!
                    </p>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                      <Badge variant="warning">+{quizScore * 15} 🪙</Badge>
                      <Badge variant="info">+{quizScore * 10} ⚡</Badge>
                    </div>
                    <Button
                      variant="accent"
                      style={{ marginTop: 20 }}
                      onClick={() => setQuizActive(false)}
                    >
                      Завершить
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* TAB: РЕЙТИНГ */}
      {activeTab === 'rating' && (
        <Card>
          <CardBody style={{ padding: 0 }}>
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>Место</th>
                  <th>Студент</th>
                  <th>Молнии</th>
                  <th>Победы</th>
                  <th>Стрик</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map(item => (
                  <tr key={item.rank}>
                    <td>
                      <span className={['rank-badge', `rank-${item.rank}`].join(' ')}>
                        {item.rank <= 3 ? ['🥇', '🥈', '🥉'][item.rank - 1] : item.rank}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{item.name}</td>
                    <td style={{ color: 'var(--lightning-color)', fontWeight: 700 }}>
                      ⚡ {item.lightning}
                    </td>
                    <td>{item.wins}</td>
                    <td style={{ color: 'var(--streak-color)' }}>🔥 {item.streak}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      )}

      {/* TAB: СОПЕРНИКИ */}
      {activeTab === 'rivals' && (
        <div className="opponents-grid">
          {opponents.map(opp => (
            <div key={opp.id} className="opponent-card">
              <span style={{ fontSize: '2rem' }}>👤</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{opp.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {opp.level} · ⚡ {opp.lightning} · 🏆 {opp.wins}
                </div>
                <div style={{ fontSize: '0.72rem', color: opp.online ? 'var(--success)' : 'var(--text-muted)' }}>
                  {opp.online ? '● В сети' : '○ Не в сети'}
                </div>
              </div>
              <Button
                variant="accent"
                size="sm"
                onClick={() => {
                  setOpponent(opp);
                  setActiveTab('battle');
                }}
              >
                Вызвать
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* TAB: ЭМОЦИИ */}
      {activeTab === 'emotions' && (
        <Card>
          <CardBody>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 16, fontSize: '0.875rem' }}>
              Выберите эмоцию, чтобы отправить её сопернику в бою:
            </p>
            <div className="emotions-grid">
              {emotions.map((emoji, i) => (
                <button
                  key={i}
                  className="emotion-btn"
                  onClick={() => {
                    setSentEmoji(emoji);
                    setActiveTab('battle');
                  }}
                  title="Отправить эмоцию"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

