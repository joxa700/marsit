// LanguageContext — ru/uz for Eduvers section
import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext(null);

const translations = {
  ru: {
    eduvers: {
      title: 'Эдуверс — Образование для всех',
      subtitle: 'Выберите свою возрастную группу',
      group1: '7–11 лет',
      group1desc: 'Начинаем с основ',
      group2: '12–17 лет',
      group2desc: 'Углублённое изучение',
      start: 'Начать обучение',
      features: 'Что вас ждёт:',
      f1: 'Интерактивные уроки',
      f2: 'Игровые задания',
      f3: 'Соревнования и баттлы',
      f4: 'Сертификаты',
    },
  },
  uz: {
    eduvers: {
      title: 'Eduvers — Hammaga ta\'lim',
      subtitle: 'Yosh guruhingizni tanlang',
      group1: '7–11 yosh',
      group1desc: 'Asoslardan boshlaymiz',
      group2: '12–17 yosh',
      group2desc: 'Chuqurlashtirilgan o\'rganish',
      start: 'O\'qishni boshlash',
      features: 'Siz uchun nima bor:',
      f1: 'Interaktiv darslar',
      f2: 'O\'yin vazifalari',
      f3: 'Musobaqalar va janglar',
      f4: 'Sertifikatlar',
    },
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('marsit_lang') || 'ru';
  });

  function toggleLang() {
    const next = lang === 'ru' ? 'uz' : 'ru';
    setLang(next);
    localStorage.setItem('marsit_lang', next);
  }

  function t(section, key) {
    return translations[lang]?.[section]?.[key] || key;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

