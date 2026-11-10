import { Trash2 } from 'lucide-react';
import { Avatar } from '../../components/ui';
import { formatRelativeTime } from './time';

export default function CommentList({
  comments,
  user,
  isAdmin,
  loading,
  error,
  onDelete,
  onRetry,
}) {
  if (loading) {
    return <div className="blog-comments-status">Izohlar yuklanmoqda...</div>;
  }

  if (error && comments.length === 0) {
    return (
      <div className="blog-comments-status error">
        {error}
        <button type="button" className="blog-comments-retry" onClick={onRetry}>
          Qayta urinish
        </button>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="blog-comments-status error" role="alert">
          {error}
        </div>
      )}

      {comments.length === 0 ? (
        <div className="blog-comments-status">Hali izohlar yo'q. Birinchi bo'lib yozing!</div>
      ) : (
        <div className="blog-comment-list">
          {comments.map(comment => {
            const canDelete =
              isAdmin || String(comment.authorId) === String(user?.id);

            return (
              <div key={comment.id} className="blog-comment">
                <Avatar name={comment.name} size="sm" />
                <div className="blog-comment-content">
                  <div className="blog-comment-head">
                    <span className="blog-comment-name">{comment.name}</span>
                    <span className="blog-comment-time">
                      {formatRelativeTime(comment.createdAt)}
                    </span>
                    {canDelete && (
                      <button
                        type="button"
                        className="blog-icon-btn"
                        onClick={() => onDelete(comment)}
                        aria-label="Izohni o'chirish"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <p className="blog-comment-text">{comment.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
