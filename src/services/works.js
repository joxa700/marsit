// Student works service. Hozircha localStorage; keyin API'ga ko'chiriladi.
import { readStore, writeStore, makeId, isValidUrl } from './storage';

const WORKS_KEY = 'marsit_works_v1';

export const WORK_STATUS = {
  PENDING: 'Tekshiruvda',
  RETURNED: 'Qaytarildi',
  ACCEPTED: 'Qabul qilindi',
};

export const WORK_STATUS_LIST = [
  WORK_STATUS.PENDING,
  WORK_STATUS.RETURNED,
  WORK_STATUS.ACCEPTED,
];

export function listWorks() {
  return readStore(WORKS_KEY, []);
}

/**
 * Faqat shu studentning ishlari. Boshqa student ishlariga kirish yo'li yo'q.
 */
export function listWorksByStudent(studentId) {
  if (!studentId) return [];
  return listWorks().filter(work => String(work.studentId) === String(studentId));
}

export function createWork({ studentId, title, link }) {
  if (!studentId) throw new Error('Foydalanuvchi aniqlanmadi');
  if (!String(title || '').trim()) throw new Error('Ish nomini kiriting');
  if (!isValidUrl(link)) throw new Error("Havola noto'g'ri (http:// yoki https:// bilan boshlanishi kerak)");

  const work = {
    id: makeId('work'),
    studentId: String(studentId),
    title: String(title).trim(),
    link: String(link).trim(),
    status: WORK_STATUS.PENDING,
    comment: '',
    createdAt: new Date().toISOString(),
  };
  writeStore(WORKS_KEY, [...listWorks(), work]);
  return work;
}

export function updateWork(id, studentId, { title, link }) {
  const works = listWorks();
  const idx = works.findIndex(work => String(work.id) === String(id));
  if (idx === -1) throw new Error('Ish topilmadi');
  if (String(works[idx].studentId) !== String(studentId)) {
    throw new Error("Bu ish sizga tegishli emas");
  }
  if (!String(title || '').trim()) throw new Error('Ish nomini kiriting');
  if (!isValidUrl(link)) throw new Error("Havola noto'g'ri (http:// yoki https:// bilan boshlanishi kerak)");

  works[idx] = {
    ...works[idx],
    title: String(title).trim(),
    link: String(link).trim(),
    status: WORK_STATUS.PENDING,
    comment: '',
    updatedAt: new Date().toISOString(),
  };
  writeStore(WORKS_KEY, works);
  return works[idx];
}

export function deleteWork(id, studentId) {
  const works = listWorks();
  const work = works.find(item => String(item.id) === String(id));
  if (!work) throw new Error('Ish topilmadi');
  if (String(work.studentId) !== String(studentId)) {
    throw new Error("Bu ish sizga tegishli emas");
  }
  writeStore(WORKS_KEY, works.filter(item => String(item.id) !== String(id)));
}

export function setWorkStatus(id, status, comment = '') {
  const works = listWorks();
  const idx = works.findIndex(work => String(work.id) === String(id));
  if (idx === -1) throw new Error('Ish topilmadi');
  works[idx] = {
    ...works[idx],
    status,
    comment: String(comment || '').trim(),
    checkedAt: new Date().toISOString(),
  };
  writeStore(WORKS_KEY, works);
  return works[idx];
}
