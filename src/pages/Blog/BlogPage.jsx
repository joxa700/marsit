import { useCallback, useEffect, useState } from 'react';
import { Button, Card, CardBody } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { isBlockedAccount } from '../../config/auth';
import {
  BLOG_PAGE_SIZE,
  deletePost,
  getPosts,
  toggleLike,
  updateCommentsCount,
} from '../../services/blog';
import PostComposer from './PostComposer';
import PostCard from './PostCard';
import './Blog.css';

function BlogSkeleton() {
  return (
    <div className="blog-feed" aria-hidden="true">
      {[0, 1, 2].map(item => (
        <Card key={item} className="blog-skeleton">
          <CardBody>
            <div className="blog-skeleton-head">
              <div className="blog-skeleton-avatar" />
              <div className="blog-skeleton-lines">
                <div className="blog-skeleton-line short" />
                <div className="blog-skeleton-line tiny" />
              </div>
            </div>
            <div className="blog-skeleton-line" />
            <div className="blog-skeleton-line" />
            <div className="blog-skeleton-line medium" />
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

export default function BlogPage() {
  const { user, isAdmin } = useAuth();
  const blocked = isBlockedAccount(user);

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [toast, setToast] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const showToast = useCallback((text, tone = 'success') => {
    setToast({ text, tone });
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const loadFirstPage = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await getPosts({ page: 1, limit: BLOG_PAGE_SIZE });
      setPosts(data);
      setPage(1);
      setHasMore(data.length === BLOG_PAGE_SIZE);
    } catch (err) {
      setLoadError(err.message || "Postlarni yuklab bo'lmadi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    getPosts({ page: 1, limit: BLOG_PAGE_SIZE })
      .then(data => {
        if (!active) return;
        setPosts(data);
        setPage(1);
        setHasMore(data.length === BLOG_PAGE_SIZE);
      })
      .catch(err => {
        if (active) setLoadError(err.message || "Postlarni yuklab bo'lmadi.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function handleCreated(post) {
    setPosts(prev => [post, ...prev]);
    showToast('Post joylandi');
  }

  async function handleLoadMore() {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await getPosts({ page: nextPage, limit: BLOG_PAGE_SIZE });
      setPosts(prev => {
        const seen = new Set(prev.map(item => String(item.id)));
        return [...prev, ...data.filter(item => !seen.has(String(item.id)))];
      });
      setPage(nextPage);
      setHasMore(data.length === BLOG_PAGE_SIZE);
    } catch (err) {
      showToast(err.message || "Yuklab bo'lmadi.", 'error');
    } finally {
      setLoadingMore(false);
    }
  }

  async function handleLike(post) {
    if (blocked) return;

    const uid = String(user.id);
    const wasLiked = post.likes.some(id => String(id) === uid);
    const optimistic = {
      ...post,
      likes: wasLiked
        ? post.likes.filter(id => String(id) !== uid)
        : [...post.likes, uid],
    };

    setPosts(prev =>
      prev.map(item => (String(item.id) === String(post.id) ? optimistic : item))
    );

    try {
      const saved = await toggleLike(optimistic, uid);
      setPosts(prev =>
        prev.map(item =>
          String(item.id) === String(post.id)
            ? { ...item, likes: saved.likes }
            : item
        )
      );
    } catch (err) {
      setPosts(prev =>
        prev.map(item => (String(item.id) === String(post.id) ? post : item))
      );
      showToast(err.message || "Laykni saqlashda xatolik.", 'error');
    }
  }

  function handleCommentCountChange(post, delta) {
    const nextCount = Math.max(0, (Number(post.commentsCount) || 0) + delta);
    const updated = { ...post, commentsCount: nextCount };

    setPosts(prev =>
      prev.map(item =>
        String(item.id) === String(post.id)
          ? { ...item, commentsCount: nextCount }
          : item
      )
    );

    updateCommentsCount(updated).catch(() => {
      // Izohlar soni API'da yangilanmasa ham UI ishlashda davom etadi.
    });
  }

  async function handleDelete(post) {
    const canDelete = isAdmin || String(post.authorId) === String(user.id);
    if (!canDelete) return;
    if (!window.confirm("Postni o'chirmoqchimisiz? Izohlar ham o'chiriladi.")) return;

    setDeletingId(post.id);
    try {
      await deletePost(post.id);
      setPosts(prev => prev.filter(item => String(item.id) !== String(post.id)));
      showToast("Post o'chirildi");
    } catch (err) {
      showToast(err.message || "Postni o'chirishda xatolik.", 'error');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="blog-page">
      <h1 className="page-title">Blog</h1>

      {blocked && (
        <div className="blog-blocked-notice" role="alert">
          Akkauntingiz bloklangan. Post yozish, layk bosish va izoh qoldirish mumkin emas.
        </div>
      )}

      <PostComposer user={user} blocked={blocked} onCreated={handleCreated} />

      {loading && <BlogSkeleton />}

      {!loading && loadError && (
        <Card>
          <CardBody>
            <div className="blog-state">
              <div className="blog-state-icon">⚠️</div>
              <h3>Xatolik yuz berdi</h3>
              <p>{loadError}</p>
              <Button variant="accent" onClick={loadFirstPage}>
                Qayta urinish
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {!loading && !loadError && posts.length === 0 && (
        <Card>
          <CardBody>
            <div className="blog-state">
              <div className="blog-state-icon">📝</div>
              <h3>Hali postlar yo'q. Birinchi bo'lib yozing!</h3>
            </div>
          </CardBody>
        </Card>
      )}

      {!loading && posts.length > 0 && (
        <div className="blog-feed">
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              user={user}
              isAdmin={isAdmin}
              blocked={blocked}
              deleting={String(deletingId) === String(post.id)}
              onDelete={handleDelete}
              onLike={handleLike}
              onCommentCountChange={handleCommentCountChange}
            />
          ))}
        </div>
      )}

      {!loading && !loadError && posts.length > 0 && hasMore && (
        <div className="blog-load-more">
          <Button variant="outline" onClick={handleLoadMore} disabled={loadingMore}>
            {loadingMore ? 'Yuklanmoqda...' : 'Yana yuklash'}
          </Button>
        </div>
      )}

      {toast && (
        <div
          className={['blog-toast', toast.tone === 'error' ? 'error' : ''].join(' ')}
          role="status"
        >
          {toast.text}
        </div>
      )}
    </div>
  );
}
