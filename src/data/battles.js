// Mock battle / rating data
export const leaderboard = [
  { rank: 1, name: 'Алишер К.', avatar: null, lightning: 420, wins: 38, streak: 15 },
  { rank: 2, name: 'Малика У.', avatar: null, lightning: 380, wins: 32, streak: 12 },
  { rank: 3, name: 'Санжар Р.', avatar: null, lightning: 350, wins: 28, streak: 10 },
  { rank: 4, name: 'Дилноза М.', avatar: null, lightning: 310, wins: 24, streak: 8 },
  { rank: 5, name: 'Бобур Т.', avatar: null, lightning: 280, wins: 20, streak: 7 },
  { rank: 6, name: 'Нилуфар А.', avatar: null, lightning: 250, wins: 18, streak: 5 },
  { rank: 7, name: 'Камол Ф.', avatar: null, lightning: 220, wins: 15, streak: 4 },
  { rank: 8, name: 'Гулноза Ш.', avatar: null, lightning: 190, wins: 12, streak: 3 },
];

export const opponents = [
  { id: 1, name: 'Алишер К.', level: 'Про', wins: 38, lightning: 420, online: true },
  { id: 2, name: 'Малика У.', level: 'Эксперт', wins: 32, lightning: 380, online: true },
  { id: 3, name: 'Санжар Р.', level: 'Средний', wins: 28, lightning: 350, online: false },
  { id: 4, name: 'Дилноза М.', level: 'Новичок', wins: 24, lightning: 310, online: true },
];

export const emotions = ['🔥', '💪', '🚀', '😎', '👑', '⚡', '🎯', '💡', '🏆', '😤', '🤖', '🌟', '💥', '🎮', '👾', '🦾'];

export const battleQuizQuestions = [
  { q: 'Что такое семантический HTML?', options: ['HTML с правильными тегами', 'HTML без CSS', 'HTML с JS', 'HTML5 только'], correct: 0 },
  { q: 'Какой хук React используется для состояния?', options: ['useEffect', 'useState', 'useRef', 'useMemo'], correct: 1 },
  { q: 'Что означает CSS в переводе?', options: ['Cascading Style Sheets', 'Computer Style System', 'Creative Style Sheets', 'Cascading System Styles'], correct: 0 },
  { q: 'Метод массива для перебора элементов?', options: ['.filter()', '.map()', '.reduce()', '.forEach()'], correct: 1 },
  { q: 'Что такое API?', options: ['Программный интерфейс приложения', 'База данных', 'Язык программирования', 'Браузер'], correct: 0 },
];

