import { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { Button, Badge } from '../../components/ui';
import {
  addLesson,
  createCourse,
  deleteCourse,
  deleteLesson,
  listCourses,
  moveLesson,
  updateCourse,
  updateLesson,
} from '../../services/courses';
import { isValidUrl } from '../../services/storage';
import AdminModal from './AdminModal';

const EMPTY_COURSE = { name: '', category: 'Frontend', level: "Boshlang'ich", description: '' };
const EMPTY_LESSON = { title: '', description: '', url: '' };

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState('');

  const [courseModal, setCourseModal] = useState(null);
  const [courseForm, setCourseForm] = useState(EMPTY_COURSE);
  const [formError, setFormError] = useState('');

  const [lessonModal, setLessonModal] = useState(null);
  const [lessonForm, setLessonForm] = useState(EMPTY_LESSON);

  function loadCourses() {
    setCourses(listCourses());
  }

  useEffect(() => {
    loadCourses();
  }, []);

  function openCreateCourse() {
    setCourseModal('create');
    setCourseForm(EMPTY_COURSE);
    setFormError('');
  }

  function openEditCourse(course) {
    setCourseModal('edit');
    setCourseForm({
      name: course.name || '',
      category: course.category || 'Frontend',
      level: course.level || "Boshlang'ich",
      description: course.description || '',
    });
    setFormError('');
    setExpandedId(course.id);
  }

  function closeCourseModal() {
    setCourseModal(null);
    setCourseForm(EMPTY_COURSE);
    setFormError('');
  }

  function saveCourse(e) {
    e.preventDefault();
    setFormError('');
    if (!courseForm.name.trim()) {
      setFormError('Kurs nomini kiriting');
      return;
    }
    try {
      const payload = {
        name: courseForm.name.trim(),
        category: courseForm.category,
        level: courseForm.level.trim(),
        description: courseForm.description.trim(),
      };
      if (courseModal === 'edit' && expandedId) {
        updateCourse(expandedId, payload);
      } else {
        const created = createCourse(payload);
        setExpandedId(created.id);
      }
      closeCourseModal();
      loadCourses();
    } catch (err) {
      setFormError(err.message || 'Saqlashda xatolik');
    }
  }

  function handleDeleteCourse(course) {
    if (!window.confirm(`"${course.name}" kursini va uning darslarini o'chirmoqchimisiz?`)) return;
    try {
      deleteCourse(course.id);
      if (String(expandedId) === String(course.id)) setExpandedId(null);
      loadCourses();
    } catch (err) {
      setError(err.message || 'O‘chirishda xatolik');
    }
  }

  function openLessonCreate(courseId) {
    setLessonModal({ mode: 'create', courseId, lessonId: null });
    setLessonForm(EMPTY_LESSON);
    setFormError('');
  }

  function openLessonEdit(courseId, lesson) {
    setLessonModal({ mode: 'edit', courseId, lessonId: lesson.id });
    setLessonForm({
      title: lesson.title || '',
      description: lesson.description || '',
      url: lesson.url || '',
    });
    setFormError('');
  }

  function closeLessonModal() {
    setLessonModal(null);
    setLessonForm(EMPTY_LESSON);
    setFormError('');
  }

  function saveLesson(e) {
    e.preventDefault();
    setFormError('');
    if (!lessonForm.title.trim()) {
      setFormError('Dars nomini kiriting');
      return;
    }
    if (lessonForm.url && !isValidUrl(lessonForm.url)) {
      setFormError("Havola noto'g'ri (http:// yoki https:// bilan boshlanishi kerak)");
      return;
    }
    try {
      const payload = {
        title: lessonForm.title.trim(),
        description: lessonForm.description.trim(),
        url: lessonForm.url.trim(),
      };
      if (lessonModal.mode === 'edit') {
        updateLesson(lessonModal.courseId, lessonModal.lessonId, payload);
      } else {
        addLesson(lessonModal.courseId, payload);
      }
      closeLessonModal();
      loadCourses();
    } catch (err) {
      setFormError(err.message || 'Saqlashda xatolik');
    }
  }

  function handleDeleteLesson(courseId, lesson) {
    if (!window.confirm(`"${lesson.title}" darsini o'chirmoqchimisiz?`)) return;
    try {
      deleteLesson(courseId, lesson.id);
      loadCourses();
    } catch (err) {
      setError(err.message || 'O‘chirishda xatolik');
    }
  }

  function handleMoveLesson(courseId, lessonId, direction) {
    try {
      moveLesson(courseId, lessonId, direction);
      loadCourses();
    } catch (err) {
      setError(err.message || 'Tartibni o‘zgartirishda xatolik');
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="page-title">Kurslar</h1>
          <div className="admin-subtitle">Kurslar va darslarni boshqarish</div>
        </div>
        <div className="admin-chip-row">
          <Button variant="ghost" size="sm" onClick={loadCourses}>
            <RefreshCw size={16} /> Yangilash
          </Button>
          <Button variant="accent" onClick={openCreateCourse}>+ Kurs qo‘shish</Button>
        </div>
      </div>

      {error && <div className="admin-form-error" style={{ marginBottom: 16 }}>{error}</div>}

      {courses.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">📚</div>
          <h3>Hali kurs yo‘q</h3>
          <p>Kurs yarating, darslarni qo‘shing va guruhlarga biriktiring.</p>
        </div>
      ) : (
        <div className="admin-course-list">
          {courses.map(course => {
            const expanded = String(expandedId) === String(course.id);
            const lessons = course.lessons || [];
            return (
              <div key={course.id} className="admin-course-card">
                <div className="admin-course-head">
                  <div>
                    <div className="admin-course-title">{course.name}</div>
                    <div className="admin-course-meta">
                      {lessons.length} dars · {course.category} · {course.level}
                    </div>
                    {course.description && (
                      <div className="admin-course-meta">{course.description}</div>
                    )}
                  </div>
                  <div className="admin-actions">
                    <Badge variant="accent">{course.category}</Badge>
                    <button
                      className="admin-icon-btn"
                      title={expanded ? 'Darslarni yopish' : 'Darslarni ochish'}
                      onClick={() => setExpandedId(expanded ? null : course.id)}
                    >
                      {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    <button className="admin-icon-btn" title="Tahrirlash" onClick={() => openEditCourse(course)}>
                      <Pencil size={16} />
                    </button>
                    <button className="admin-icon-btn danger" title="O‘chirish" onClick={() => handleDeleteCourse(course)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {expanded && (
                  <div className="admin-course-body">
                    {lessons.length === 0 ? (
                      <div className="admin-filters-note" style={{ marginBottom: 12 }}>
                        Hali dars qo‘shilmagan.
                      </div>
                    ) : (
                      <div className="admin-lesson-list">
                        {lessons.map((lesson, index) => (
                          <div key={lesson.id} className="admin-lesson-item">
                            <div>
                              <div className="admin-lesson-title">
                                <span className="admin-lesson-num">{index + 1}.</span>
                                {lesson.title}
                              </div>
                              {lesson.description && (
                                <div className="admin-lesson-meta">{lesson.description}</div>
                              )}
                              {lesson.url && (
                                <a href={lesson.url} target="_blank" rel="noreferrer" className="admin-lesson-meta">
                                  {lesson.url}
                                </a>
                              )}
                            </div>
                            <div className="admin-actions">
                              <button
                                className="admin-icon-btn"
                                title="Yuqoriga"
                                onClick={() => handleMoveLesson(course.id, lesson.id, -1)}
                                disabled={index === 0}
                              >
                                <ArrowUp size={16} />
                              </button>
                              <button
                                className="admin-icon-btn"
                                title="Pastga"
                                onClick={() => handleMoveLesson(course.id, lesson.id, 1)}
                                disabled={index === lessons.length - 1}
                              >
                                <ArrowDown size={16} />
                              </button>
                              <button
                                className="admin-icon-btn"
                                title="Tahrirlash"
                                onClick={() => openLessonEdit(course.id, lesson)}
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                className="admin-icon-btn danger"
                                title="O‘chirish"
                                onClick={() => handleDeleteLesson(course.id, lesson)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <Button variant="outline" size="sm" onClick={() => openLessonCreate(course.id)}>
                      + Dars qo‘shish
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {courseModal && (
        <AdminModal
          title={courseModal === 'create' ? 'Yangi kurs' : 'Kursni tahrirlash'}
          onClose={closeCourseModal}
          footer={
            <>
              <Button variant="ghost" onClick={closeCourseModal}>Bekor qilish</Button>
              <Button variant="accent" type="submit" form="course-form">Saqlash</Button>
            </>
          }
        >
          <form id="course-form" className="admin-form" onSubmit={saveCourse}>
            <div className="admin-field">
              <label htmlFor="course-name">Kurs nomi</label>
              <input
                id="course-name"
                type="text"
                value={courseForm.name}
                onChange={e => setCourseForm({ ...courseForm, name: e.target.value })}
                placeholder="Masalan: React.js Professional"
              />
            </div>
            <div className="admin-form-grid">
              <div className="admin-field">
                <label htmlFor="course-category">Kategoriya</label>
                <select
                  id="course-category"
                  value={courseForm.category}
                  onChange={e => setCourseForm({ ...courseForm, category: e.target.value })}
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="DevOps">DevOps</option>
                </select>
              </div>
              <div className="admin-field">
                <label htmlFor="course-level">Daraja</label>
                <input
                  id="course-level"
                  type="text"
                  value={courseForm.level}
                  onChange={e => setCourseForm({ ...courseForm, level: e.target.value })}
                  placeholder="Boshlang'ich / O'rta / Yuqori"
                />
              </div>
            </div>
            <div className="admin-field">
              <label htmlFor="course-description">Tavsif</label>
              <textarea
                id="course-description"
                rows={3}
                value={courseForm.description}
                onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
                placeholder="Kurs haqida qisqacha..."
              />
            </div>
            {formError && <div className="admin-form-error" role="alert">{formError}</div>}
          </form>
        </AdminModal>
      )}

      {lessonModal && (
        <AdminModal
          title={lessonModal.mode === 'create' ? 'Yangi dars' : 'Darsni tahrirlash'}
          onClose={closeLessonModal}
          footer={
            <>
              <Button variant="ghost" onClick={closeLessonModal}>Bekor qilish</Button>
              <Button variant="accent" type="submit" form="lesson-form">Saqlash</Button>
            </>
          }
        >
          <form id="lesson-form" className="admin-form" onSubmit={saveLesson}>
            <div className="admin-field">
              <label htmlFor="lesson-title">Dars nomi</label>
              <input
                id="lesson-title"
                type="text"
                value={lessonForm.title}
                onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })}
                placeholder="Masalan: useState hook"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="lesson-description">Tavsif</label>
              <textarea
                id="lesson-description"
                rows={3}
                value={lessonForm.description}
                onChange={e => setLessonForm({ ...lessonForm, description: e.target.value })}
                placeholder="Dars haqida qisqacha..."
              />
            </div>
            <div className="admin-field">
              <label htmlFor="lesson-url">Video / havola</label>
              <input
                id="lesson-url"
                type="url"
                value={lessonForm.url}
                onChange={e => setLessonForm({ ...lessonForm, url: e.target.value })}
                placeholder="https://youtube.com/..."
              />
              <span className="admin-field-hint">Ixtiyoriy. To‘ldirilsa, http(s) havola bo‘lishi kerak.</span>
            </div>
            {formError && <div className="admin-form-error" role="alert">{formError}</div>}
          </form>
        </AdminModal>
      )}
    </div>
  );
}
