import { useState } from 'react';
import { Heart, MessageCircle, Trash2 } from 'lucide-react';
import { Avatar, Card, CardBody } from '../../components/ui';
import { addComment, deleteComment, getComments } from '../../services/blog';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import { displayName, formatRelativeTime } from './time';

export default function PostCard({
  post,
  user,
  isAdmin,
  blocked,
  deleting,
  onDelete,
  onLike,
  onCommentCountChange,
}) {
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState('');
  const [liking, setLiking] = useState(false);
  const [failedImage, setFailedImage] = useState('');

  const liked = post.likes.some(id => String(id) === String(user?.id));
  const canDeletePost = isAdmin || String(post.authorId) === String(user?.id);

  async function loadComments() {
    setCommentsLoading(true);
    setCommentsError('');
    try {
      const data = await getComments(post.id);
      setComments(data);
      setCommentsLoaded(true);
    } catch (err) {
      setCommentsError(err.message || "Izohlarni yuklab bo'lmadi.");
    } finally {
      setCommentsLoading(false);
    }
  }

  function handleToggleComments() {
    const next = !expanded;
    setExpanded(next);
    if (next && !commentsLoaded && !commentsLoading) {
      loadComments();
    }
  }

  async function handleLike() {
    if (blocked || liking) return;
    setLiking(true);
    try {
      await onLike(post);
    } finally {
      setLiking(false);
    }
  }

  async function handleAddComment(value) {
    const created = await addComment({
      postId: post.id,
      authorId: user.id,
      name: displayName(user),
      avatar: '',
      text: value,
    });

    if (commentsLoaded) {
      setComments(prev => [...prev, created]);
    } else {
      loadComments();
    }
    onCommentCountChange(post, 1);
  }

  async function handleDeleteComment(comment) {
    if (!window.confirm("Izohni o'chirmoqchimisiz?")) return;
    try {
      await deleteComment(comment.id);
      setComments(prev =>
        prev.filter(item => String(item.id) !== String(comment.id))
      );
      onCommentCountChange(post, -1);
    } catch (err) {
      setCommentsError(err.message || "Izohni o'chirishda xatolik yuz berdi.");
    }
  }

  return (
    <Card className="blog-post">
      <CardBody>
        <div className="blog-post-head">
          <Avatar name={post.name} size="md" />
          <div className="blog-post-author">
            <span className="blog-post-name">{post.name}</span>
            <span className="blog-post-time">{formatRelativeTime(post.createdAt)}</span>
          </div>
          {canDeletePost && (
            <button
              type="button"
              className="blog-icon-btn"
              onClick={() => onDelete(post)}
              disabled={deleting}
              aria-label="Postni o'chirish"
            >
              <Trash2 size={17} />
            </button>
          )}
        </div>

        {post.text && <p className="blog-post-text">{post.text}</p>}

        {post.image && failedImage !== post.image && (
          <img
            className="blog-post-image"
            src={post.image}
            alt="Post rasmi"
            loading="lazy"
            onError={() => setFailedImage(post.image)}
          />
        )}

        <div className="blog-post-actions">
          <button
            type="button"
            className={['blog-action-btn', liked ? 'liked' : ''].join(' ')}
            onClick={handleLike}
            disabled={blocked || liking}
            aria-pressed={liked}
            aria-label={liked ? "Laykni olib tashlash" : 'Layk bosish'}
          >
            <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
            <span>{post.likes.length}</span>
          </button>

          <button
            type="button"
            className={['blog-action-btn', expanded ? 'active' : ''].join(' ')}
            onClick={handleToggleComments}
            aria-expanded={expanded}
          >
            <MessageCircle size={18} />
            <span>{post.commentsCount}</span>
          </button>
        </div>

        {expanded && (
          <div className="blog-comments">
            <CommentList
              comments={comments}
              user={user}
              isAdmin={isAdmin}
              loading={commentsLoading}
              error={commentsError}
              onDelete={handleDeleteComment}
              onRetry={loadComments}
            />

            {blocked ? (
              <div className="blog-comments-blocked">
                Akkaunt bloklangan — izoh yozib bo‘lmaydi.
              </div>
            ) : (
              <CommentForm onSubmit={handleAddComment} disabled={commentsLoading} />
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
