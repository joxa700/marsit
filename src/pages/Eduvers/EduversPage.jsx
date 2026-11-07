// Eduvers standalone landing page with ru/uz language support
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme, THEMES } from '../../context/ThemeContext';
import { Button, Badge } from '../../components/ui';
import './Eduvers.css';

export default function EduversPage() {
  const { lang, setLang, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [selectedGroup, setSelectedGroup] = useState('7-11');

  const content = {
    ru: {
      platformBack: '← В кабинет Mars IT',
      badge: '🪐 Образовательная вселенная Mars',
      tagline: 'Интерактивное обучение программированию и цифровым технологиям для школьников от 7 до 17 лет.',
      group1Title: 'Младшая лига',
      group1Sub: 'Scratch, логика, создание первых игр и анимаций в дружелюбной атмосфере.',
      group1Feat: [
        'Визуальное программирование на Scratch',
        'Развитие алгоритмического мышления',
        'Безопасность в интернете и цифровая гигиена',
        'Индивидуальный наставник в каждой группе',
      ],
      group2Title: 'Старшая лига',
      group2Sub: 'Frontend, Python, веб-разработка, командные проекты и подготовка к карьере.',
      group2Feat: [
        'HTML, CSS, JavaScript и основы React',
        'Разработка реальных сайтов и ботов',
        'Участие в хакатонах и IT-баттлах',
        'Портфолио проектов для поступления в вуз',
      ],
      featuresTitle: 'Почему дети и родители выбирают Mars Eduvers',
      f1Title: 'Геймификация',
      f1Desc: 'Монеты, молнии, уровни и рейтинги превращают обучение в захватывающую игру.',
      f2Title: 'Командные хакатоны',
      f2Desc: 'Студенты объединяются в команды и создают проекты с реальными призами.',
      f3Title: 'AI-наставник',
      f3Desc: 'Персональный искусственный интеллект помогает с заданиями 24/7.',
      f4Title: 'Сертификат Mars IT',
      f4Desc: 'Официальный документ, подтверждающий освоенные навыки и технологии.',
      startNow: 'Начать обучение',
      selectedBadge: 'Выбранная группа',
    },
    uz: {
      platformBack: '← Mars IT kabinetiga',
      badge: '🪐 Mars ta\'lim koinoti',
      tagline: '7 yoshdan 17 yoshgacha bo\'lgan maktab o\'quvchilari uchun dasturlash va raqamli texnologiyalarni interaktiv o\'rganish.',
      group1Title: 'Kichik liga',
      group1Sub: 'Scratch, mantiq, do\'stona muhitda dastlabki o\'yinlar va animatsiyalar yaratish.',
      group1Feat: [
        'Scratch orqali vizual dasturlash',
        'Algoritmik fikrlashni rivojlantirish',
        'Internetda xavfsizlik va raqamli gigiyena',
        'Har bir guruhda shaxsiy mentor',
      ],
      group2Title: 'Katta liga',
      group2Sub: 'Frontend, Python, veb-dasturlash, jamoaviy loyihalar va IT karyeraga tayyorgarlik.',
      group2Feat: [
        'HTML, CSS, JavaScript va React asoslari',
        'Haqiqiy veb-saytlar va botlar yaratish',
        'Xakatonlar va IT-battllarda ishtirok',
        'OTMga kirish uchun loyihalar portfolioli',
      ],
      featuresTitle: 'Nima uchun o\'quvchilar va ota-onalar Mars Eduversni tanlaydi',
      f1Title: 'Geymifikatsiya',
      f1Desc: 'Tangalar, chaqmoqlar, bosqichlar va reytinglar o\'qishni qiziqarli o\'yinga aylantiradi.',
      f2Title: 'Jamoaviy xakatonlar',
      f2Desc: 'O\'quvchilar jamoalarga birlashib, qimmatbaho sovg\'alar uchun kurashadi.',
      f3Title: 'AI-yordamchi',
      f3Desc: 'Shaxsiy sun\'iy intellekt darslar va vazifalarda 24/7 yordam beradi.',
      f4Title: 'Mars IT sertifikati',
      f4Desc: 'O\'zlashtirilgan ko\'nikmalar va texnologiyalarni tasdiqlovchi rasmiy hujjat.',
      startNow: 'O\'qishni boshlash',
      selectedBadge: 'Tanlangan guruh',
    }
  };

  const cur = content[lang] || content.ru;

  return (
    <div className="eduvers-page animate-fade-in">
      {/* Standalone Header */}
      <header className="eduvers-header">
        <Link to="/" className="eduvers-logo">
          <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="18" fill="#6366f1" />
            <circle cx="18" cy="18" r="10" fill="#ef4444" />
            <circle cx="23" cy="13" r="4" fill="#f59e0b" />
          </svg>
          <span>Mars Eduvers</span>
        </Link>

        <div className="eduvers-nav-actions">
          {/* Language Switcher ru / uz */}
          <div className="eduvers-lang-toggle" role="group" aria-label="Тил танлаш">
            <span
              style={{
                cursor: 'pointer',
                opacity: lang === 'ru' ? 1 : 0.45,
                fontWeight: lang === 'ru' ? 800 : 500,
                color: lang === 'ru' ? 'var(--accent)' : 'inherit'
              }}
              onClick={() => setLang('ru')}
            >
              🇷🇺 RU
            </span>
            <span style={{ opacity: 0.3 }}>|</span>
            <span
              style={{
                cursor: 'pointer',
                opacity: lang === 'uz' ? 1 : 0.45,
                fontWeight: lang === 'uz' ? 800 : 500,
                color: lang === 'uz' ? 'var(--accent)' : 'inherit'
              }}
              onClick={() => setLang('uz')}
            >
              🇺🇿 UZ
            </span>
          </div>

          {/* Theme switcher */}
          <div className="theme-switcher" style={{ display: 'flex' }}>
            {THEMES.map(t => (
              <button
                key={t.id}
                className={['theme-btn', theme === t.id ? 'active' : ''].join(' ')}
                onClick={() => setTheme(t.id)}
                title={t.label}
              >
                {t.emoji}
              </button>
            ))}
          </div>

          {/* Link back to Main Platform */}
          <Link to="/">
            <Button variant="outline" size="sm">
              {cur.platformBack}
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="eduvers-hero">
        <div className="eduvers-hero-badge">
          <Badge variant="accent">{cur.badge}</Badge>
        </div>
        <h1>{t('eduvers', 'title')}</h1>
        <p>{cur.tagline}</p>
      </section>

      {/* Age Group Big Cards */}
      <section className="age-cards-container">
        {/* Card 7-11 */}
        <div
          className={['age-card', selectedGroup === '7-11' ? 'active-group' : ''].join(' ')}
          onClick={() => setSelectedGroup('7-11')}
        >
          {selectedGroup === '7-11' && (
            <div className="age-card-badge">{cur.selectedBadge}</div>
          )}
          <div>
            <div className="age-card-icon">🚀</div>
            <div className="age-card-number">{t('eduvers', 'group1')}</div>
            <div className="age-card-subtitle">{cur.group1Title} — {cur.group1Sub}</div>

            <div className="age-card-features">
              {cur.group1Feat.map((f, i) => (
                <div key={i} className="age-card-feature-item">
                  <span className="check">✓</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant={selectedGroup === '7-11' ? 'accent' : 'outline'}
            size="lg"
            block
            onClick={(e) => {
              e.stopPropagation();
              setSelectedGroup('7-11');
              alert(lang === 'ru' ? 'Вы выбрали группу 7–11 лет! Добро пожаловать!' : '7-11 yosh guruhini tanladingiz! Xush kelibsiz!');
            }}
          >
            {cur.startNow} →
          </Button>
        </div>

        {/* Card 12-17 */}
        <div
          className={['age-card', selectedGroup === '12-17' ? 'active-group' : ''].join(' ')}
          onClick={() => setSelectedGroup('12-17')}
        >
          {selectedGroup === '12-17' && (
            <div className="age-card-badge">{cur.selectedBadge}</div>
          )}
          <div>
            <div className="age-card-icon">⚡</div>
            <div className="age-card-number">{t('eduvers', 'group2')}</div>
            <div className="age-card-subtitle">{cur.group2Title} — {cur.group2Sub}</div>

            <div className="age-card-features">
              {cur.group2Feat.map((f, i) => (
                <div key={i} className="age-card-feature-item">
                  <span className="check">✓</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant={selectedGroup === '12-17' ? 'accent' : 'outline'}
            size="lg"
            block
            onClick={(e) => {
              e.stopPropagation();
              setSelectedGroup('12-17');
              alert(lang === 'ru' ? 'Вы выбрали группу 12–17 лет! Добро пожаловать!' : '12-17 yosh guruhini tanladingiz! Xush kelibsiz!');
            }}
          >
            {cur.startNow} →
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="eduvers-features-section">
        <div className="eduvers-features-wrap">
          <h2 className="eduvers-features-title">{cur.featuresTitle}</h2>
          <div className="eduvers-features-grid">
            <div className="eduvers-feature-box">
              <div className="eduvers-feature-box-icon">🎮</div>
              <div className="eduvers-feature-box-title">{cur.f1Title}</div>
              <div className="eduvers-feature-box-text">{cur.f1Desc}</div>
            </div>
            <div className="eduvers-feature-box">
              <div className="eduvers-feature-box-icon">🏆</div>
              <div className="eduvers-feature-box-title">{cur.f2Title}</div>
              <div className="eduvers-feature-box-text">{cur.f2Desc}</div>
            </div>
            <div className="eduvers-feature-box">
              <div className="eduvers-feature-box-icon">🤖</div>
              <div className="eduvers-feature-box-title">{cur.f3Title}</div>
              <div className="eduvers-feature-box-text">{cur.f3Desc}</div>
            </div>
            <div className="eduvers-feature-box">
              <div className="eduvers-feature-box-icon">📜</div>
              <div className="eduvers-feature-box-title">{cur.f4Title}</div>
              <div className="eduvers-feature-box-text">{cur.f4Desc}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="eduvers-footer">
        <p>© 2026 Mars IT School · Mars Eduvers Educational Platform</p>
      </footer>
    </div>
  );
}

