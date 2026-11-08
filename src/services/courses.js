// Courses + enrollments service.
// Hozircha localStorage; API endpoint paydo bo'lsa shu fayl ichi almashtiriladi.
import { readStore, writeStore, makeId } from './storage';

const COURSES_KEY = 'marsit_courses_v1';
const ENROLLMENTS_KEY = 'marsit_enrollments_v1';

export function listCourses() {
  return readStore(COURSES_KEY, []);
}

export function getCourse(id) {
  return listCourses().find(course => String(course.id) === String(id)) || null;
}

export function createCourse({ name, category, level, description }) {
  const course = {
    id: makeId('course'),
    name: String(name || '').trim(),
    category: category || 'Frontend',
    level: level || 'Boshlang\'ich',
    description: String(description || '').trim(),
    lessons: [],
    createdAt: new Date().toISOString(),
  };
  writeStore(COURSES_KEY, [...listCourses(), course]);
  return course;
}

export function updateCourse(id, updates) {
  const courses = listCourses();
  const idx = courses.findIndex(course => String(course.id) === String(id));
  if (idx === -1) throw new Error('Kurs topilmadi');
  courses[idx] = { ...courses[idx], ...updates };
  writeStore(COURSES_KEY, courses);
  return courses[idx];
}

export function deleteCourse(id) {
  writeStore(COURSES_KEY, listCourses().filter(course => String(course.id) !== String(id)));
  const enrollments = listEnrollments().filter(item => String(item.courseId) !== String(id));
  writeStore(ENROLLMENTS_KEY, enrollments);
}

export function addLesson(courseId, { title, description, url }) {
  const course = getCourse(courseId);
  if (!course) throw new Error('Kurs topilmadi');
  const lesson = {
    id: makeId('lesson'),
    title: String(title || '').trim(),
    description: String(description || '').trim(),
    url: String(url || '').trim(),
  };
  return updateCourse(courseId, { lessons: [...(course.lessons || []), lesson] });
}

export function updateLesson(courseId, lessonId, updates) {
  const course = getCourse(courseId);
  if (!course) throw new Error('Kurs topilmadi');
  const lessons = (course.lessons || []).map(lesson =>
    String(lesson.id) === String(lessonId) ? { ...lesson, ...updates } : lesson
  );
  return updateCourse(courseId, { lessons });
}

export function deleteLesson(courseId, lessonId) {
  const course = getCourse(courseId);
  if (!course) throw new Error('Kurs topilmadi');
  return updateCourse(courseId, {
    lessons: (course.lessons || []).filter(lesson => String(lesson.id) !== String(lessonId)),
  });
}

export function moveLesson(courseId, lessonId, direction) {
  const course = getCourse(courseId);
  if (!course) throw new Error('Kurs topilmadi');
  const lessons = [...(course.lessons || [])];
  const idx = lessons.findIndex(lesson => String(lesson.id) === String(lessonId));
  const nextIdx = idx + direction;
  if (idx === -1 || nextIdx < 0 || nextIdx >= lessons.length) return course;
  [lessons[idx], lessons[nextIdx]] = [lessons[nextIdx], lessons[idx]];
  return updateCourse(courseId, { lessons });
}

// ===== Enrollments =====
export function listEnrollments() {
  return readStore(ENROLLMENTS_KEY, []);
}

export function getStudentEnrollments(studentId) {
  return listEnrollments().filter(item => String(item.studentId) === String(studentId));
}

export function enrollStudent(studentId, courseId) {
  if (!studentId || !courseId) return null;
  const enrollments = listEnrollments();
  const exists = enrollments.some(
    item =>
      String(item.studentId) === String(studentId) &&
      String(item.courseId) === String(courseId)
  );
  if (exists) return null;

  const enrollment = {
    id: makeId('enroll'),
    studentId: String(studentId),
    courseId: String(courseId),
    progress: 0,
    completedLessons: [],
    enrolledAt: new Date().toISOString(),
  };
  writeStore(ENROLLMENTS_KEY, [...enrollments, enrollment]);
  return enrollment;
}

export function enrollStudents(studentIds, courseId) {
  (studentIds || []).forEach(studentId => enrollStudent(studentId, courseId));
}

export function setEnrollmentProgress(studentId, courseId, progress) {
  const enrollments = listEnrollments().map(item => {
    const same =
      String(item.studentId) === String(studentId) &&
      String(item.courseId) === String(courseId);
    return same ? { ...item, progress: Math.max(0, Math.min(100, Number(progress) || 0)) } : item;
  });
  writeStore(ENROLLMENTS_KEY, enrollments);
}
