import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw, Trash2 } from 'lucide-react';
import { Avatar, Button } from '../../components/ui';
import { deletePost, getAllPosts } from '../../services/blog';
import { formatDateTime } from './adminUtils';

function preview(text) {
  const value = String(text || '').trim();
  if (!value) return '—';
  return value.length > 140 ? `${value.slice(0, 140)}...` : value;
}

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setPosts(await getAllPosts({ limit: 100, maxPages: 10 }));
    } catch (err) {
      setError(err.message || "Postlarni yuklashda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    getAllPosts({ limit: 100, maxPages: 10 })
      .then(data => {
        if (active) setPosts(data);
      })
      .catch(err => {
        if (active) setError(err.message || "Postlarni yuklashda xatolik yuz berdi.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return posts;
    return posts.filter(post =>
      String(post.name || '').toLowerCase().includes(query)
    );
  }, [posts, search]);

  async function handleDelete(post) {
    if (!window.confirm(`"${post.name}" postini o'chirmoqchimisiz? Izohlar ham o'chiriladi.`)) {
      return;
    }

    setDeletingId(post.id);
    setError('');
    try {
      await deletePost(post.id);
      setPosts(prev => prev.filter(item => String(item.id) !== String(post.id)));
    } catch (err) {
      setError(err.message || "Postni o'chirishda xatolik yuz berdi.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="page-title">Blog</h1>
          <div className="admin-subtitle">O‘quvchilar blog postlari</div>
        </div>
        <Button variant="ghost" size="sm" onClick={loadPosts}>
          <RefreshCw size={16} /> Yangilash
        </Button>
      </div>

      <div className="admin-toolbar">
        <input
          className="admin-search"
          type="search"
          placeholder="Muallif ismi bo‘yicha qidirish..."
          value={search}
          onChange={event => setSearch(event.target.value)}
        />
        <div className="admin-filters-note">{filtered.length} ta post</div>
      </div>

      {error && <div className="admin-form-error" style={{ marginBottom: 16 }}>{error}</div>}

      {loading ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">📰</div>
          <h3>Yuklanmoqda...</h3>
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">📰</div>
          <h3>Postlar topilmadi</h3>
          <p>
            {posts.length === 0
              ? 'Hali hech bir o‘quvchi post yozmagan.'
              : 'Qidiruv bo‘yicha post yo‘q.'}
          </p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Muallif</th>
                <th>Sana</th>
                <th>Matn</th>
                <th>Rasm</th>
                <th>Amal</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(post => (
                <tr key={post.id}>
                  <td>
                    <div className="admin-blog-author">
                      <Avatar name={post.name} src={post.avatar} size="sm" />
                      <div>
                        <div className="admin-row-title">{post.name}</div>
                        <div className="muted">ID: {post.authorId || '—'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="muted">{formatDateTime(post.createdAt)}</td>
                  <td>
                    <div className="admin-blog-text">{preview(post.text)}</div>
                  </td>
                  <td>
                    {post.image ? (
                      <a href={post.image} target="_blank" rel="noreferrer">
                        <img className="admin-blog-thumb" src={post.image} alt="Post rasmi" loading="lazy" />
                      </a>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="admin-icon-btn danger"
                      onClick={() => handleDelete(post)}
                      disabled={String(deletingId) === String(post.id)}
                      aria-label="Postni o'chirish"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
