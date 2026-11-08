// Groups service. Hozircha localStorage; keyin API'ga ko'chiriladi.
import { readStore, writeStore, makeId } from './storage';
import { enrollStudent, enrollStudents } from './courses';

const GROUPS_KEY = 'marsit_groups_v1';

export function listGroups() {
  return readStore(GROUPS_KEY, []);
}

export function getGroup(id) {
  return listGroups().find(group => String(group.id) === String(id)) || null;
}

export function createGroup({ name, courseId = '', mentor = '', days = '' }) {
  const group = {
    id: makeId('group'),
    name: String(name || '').trim(),
    courseId: courseId ? String(courseId) : '',
    mentor: String(mentor || '').trim(),
    days: String(days || '').trim(),
    studentIds: [],
    createdAt: new Date().toISOString(),
  };
  writeStore(GROUPS_KEY, [...listGroups(), group]);
  return group;
}

export function updateGroup(id, updates) {
  const groups = listGroups();
  const idx = groups.findIndex(group => String(group.id) === String(id));
  if (idx === -1) throw new Error('Guruh topilmadi');

  const previous = groups[idx];
  const next = { ...previous, ...updates };
  groups[idx] = next;
  writeStore(GROUPS_KEY, groups);

  // Kurs biriktirilganda guruhdagi hamma o'quvchiga 0% bilan kurs paydo bo'ladi
  if (next.courseId && String(next.courseId) !== String(previous.courseId || '')) {
    enrollStudents(next.studentIds || [], next.courseId);
  }

  return next;
}

export function deleteGroup(id) {
  writeStore(GROUPS_KEY, listGroups().filter(group => String(group.id) !== String(id)));
}

/**
 * Bitta o'quvchi faqat bitta guruhda bo'lishi mumkin.
 * Boshqa guruhga qo'shilsa, eskisidan avtomatik chiqariladi.
 * Qaytaradi: { previousGroupId }
 */
export function addStudentToGroup(groupId, studentId) {
  const groups = listGroups();
  let previousGroupId = '';
  let target = null;

  const nextGroups = groups.map(group => {
    const hasStudent = (group.studentIds || []).some(id => String(id) === String(studentId));
    if (hasStudent && String(group.id) !== String(groupId)) {
      previousGroupId = group.id;
    }
    if (String(group.id) === String(groupId)) {
      target = group;
      return {
        ...group,
        studentIds: hasStudent ? group.studentIds : [...(group.studentIds || []), String(studentId)],
      };
    }
    return {
      ...group,
      studentIds: (group.studentIds || []).filter(id => String(id) !== String(studentId)),
    };
  });

  if (!target) throw new Error('Guruh topilmadi');

  writeStore(GROUPS_KEY, nextGroups);

  if (target.courseId) {
    enrollStudent(studentId, target.courseId);
  }

  return { previousGroupId };
}

export function removeStudentFromGroup(groupId, studentId) {
  const groups = listGroups().map(group =>
    String(group.id) === String(groupId)
      ? {
          ...group,
          studentIds: (group.studentIds || []).filter(id => String(id) !== String(studentId)),
        }
      : group
  );
  writeStore(GROUPS_KEY, groups);
}

export function findGroupOfStudent(studentId) {
  return (
    listGroups().find(group =>
      (group.studentIds || []).some(id => String(id) === String(studentId))
    ) || null
  );
}
