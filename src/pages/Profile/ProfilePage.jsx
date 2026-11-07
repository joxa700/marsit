// Profile page — Профиль пользователя
import { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Badge } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useUserStats } from '../../context/UserStatsContext';
import './Profile.css';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { stats, addCoins, addLightning } = useUserStats();

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    group: user?.group || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleClaimDailyBonus = () => {
    addCoins(25);
    addLightning(5);
    alert('🎉 Ежедневный бонус получен! +25 монет и +5 молний');
  };

  const initials = form.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div>
      <h1 className="page-title">👤 Мой профиль</h1>

      <div className="profile-grid">
        {/* Left: User summary card */}
        <Card className="profile-card-user">
          <div className="profile-avatar-large">
            {initials || 'IT'}
          </div>
          <div className="profile-name">{form.name}</div>
          <div className="profile-group">🏫 {form.group}</div>
          <Badge variant="accent">Студент Mars IT</Badge>

          <div className="profile-stats-mini">
            <div className="profile-stat-box">
              <div className="profile-stat-box-val" style={{ color: 'var(--coin-color)' }}>
                🪙 {stats.coins}
              </div>
              <div className="profile-stat-box-lbl">Монеты</div>
            </div>
            <div className="profile-stat-box">
              <div className="profile-stat-box-val" style={{ color: 'var(--lightning-color)' }}>
                ⚡ {stats.lightning}
              </div>
              <div className="profile-stat-box-lbl">Молнии</div>
            </div>
            <div className="profile-stat-box">
              <div className="profile-stat-box-val" style={{ color: 'var(--streak-color)' }}>
                🔥 {stats.streak}
              </div>
              <div className="profile-stat-box-lbl">Стрик дней</div>
            </div>
            <div className="profile-stat-box">
              <div className="profile-stat-box-val">
                💰 {stats.balance.toLocaleString('ru')}
              </div>
              <div className="profile-stat-box-lbl">Баланс (сум)</div>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <Button variant="outline" size="sm" block onClick={handleClaimDailyBonus}>
              🎁 Забрать ежедневный бонус
            </Button>
          </div>
        </Card>

        {/* Right: Editable profile settings */}
        <Card>
          <CardHeader>
            <span className="card-title">✏️ Редактирование информации</span>
            {saved && <Badge variant="success">✓ Изменения сохранены</Badge>}
          </CardHeader>
          <CardBody>
            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="profile-form-row">
                <div className="form-group">
                  <label className="form-label">Имя и фамилия</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Электронная почта</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="profile-form-row">
                <div className="form-group">
                  <label className="form-label">Группа / Направление</label>
                  <input
                    type="text"
                    value={form.group}
                    onChange={e => setForm({ ...form, group: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Телефон</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">О себе / Цели в обучении</label>
                <textarea
                  rows="4"
                  value={form.bio}
                  onChange={e => setForm({ ...form, bio: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <Button type="submit" variant="accent">
                  💾 Сохранить изменения
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setForm({
                    name: user?.name || '',
                    email: user?.email || '',
                    group: user?.group || '',
                    phone: user?.phone || '',
                    bio: user?.bio || '',
                  })}
                >
                  Сбросить
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

