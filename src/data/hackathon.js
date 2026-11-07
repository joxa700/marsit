// Mock hackathon data
export const hackathonSteps = [
  {
    id: 1,
    icon: '👥',
    title: 'Собрать команду',
    description: 'Найди 2–4 участников и создай команду',
    status: 'done',
    action: 'Команда создана',
  },
  {
    id: 2,
    icon: '💡',
    title: 'Выбрать тему',
    description: 'Выбери тему из предложенных или предложи свою',
    status: 'in-progress',
    action: 'Выбрать тему',
  },
  {
    id: 3,
    icon: '📤',
    title: 'Сдать работу',
    description: 'Загрузи проект и презентацию до дедлайна',
    status: 'locked',
    action: 'Сдать работу',
  },
];

export const hackathonTeam = {
  name: 'Mars Coders',
  members: [
    { id: 1, name: 'Алишер К.', role: 'Frontend', avatar: null },
    { id: 2, name: 'Малика У.', role: 'Backend', avatar: null },
    { id: 3, name: 'Санжар Р.', role: 'Design', avatar: null },
  ],
};

export const hackathonTeams = [
  { id: 1, name: 'Space Devs', members: 4, topic: 'Mars Health App', score: 95 },
  { id: 2, name: 'Code Rockets', members: 3, topic: 'Red Planet Guide', score: 88 },
  { id: 3, name: 'Mars Coders', members: 3, topic: 'TBD', score: 0 },
  { id: 4, name: 'Orbit Team', members: 4, topic: 'Mars Tourism', score: 72 },
];

export const hackathonTopics = [
  { id: 1, title: 'Приложение для здоровья на Марсе', difficulty: 'Средний', taken: true },
  { id: 2, title: 'Гид по Красной планете', difficulty: 'Лёгкий', taken: true },
  { id: 3, title: 'Марсианский туризм', difficulty: 'Средний', taken: false },
  { id: 4, title: 'Система мониторинга базы', difficulty: 'Сложный', taken: false },
  { id: 5, title: 'AI ассистент для астронавтов', difficulty: 'Сложный', taken: false },
];

export const hackathonGallery = [
  { id: 1, team: 'Space Devs', title: 'Mars Health App', color: '#6366f1' },
  { id: 2, team: 'Code Rockets', title: 'Red Planet Guide', color: '#ef4444' },
  { id: 3, team: 'Orbit Team', title: 'Mars Tourism', color: '#f59e0b' },
];

