import { useEffect, useRef, useState } from 'react';
import { ImagePlus, Link2, Trash2 } from 'lucide-react';
import { Avatar, Button, Card, CardBody, ProgressBar } from '../../components/ui';
import { createPost, POST_TEXT_LIMIT } from '../../services/blog';
import { uploadImage } from '../../services/imageUpload';
import { displayName } from './time';

const COOLDOWN_SECONDS = 10;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function cooldownKey(userId) {
  return `marsit_blog_last_post_${userId || 'guest'}`;
}

function getRemainingCooldown(userId) {
  try {
    const last = Number(localStorage.getItem(cooldownKey(userId)) || 0);
    if (!last) return 0;
    const remaining = Math.ceil(
      (COOLDOWN_SECONDS * 1000 - (Date.now() - last)) / 1000
    );
    return remaining > 0 ? remaining : 0;
  } catch {
    return 0;
  }
}

function isValidHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function PostComposer({ user, blocked = false, onCreated }) {
  const [expanded, setExpanded] = useState(false);
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploadPercent, setUploadPercent] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(() => getRemainingCooldown(user?.id));

  const [linkOpen, setLinkOpen] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkStatus, setLinkStatus] = useState('idle');
  const [linkError, setLinkError] = useState('');

  const fileInputRef = useRef(null);
  const linkInputRef = useRef(null);
  const submitLockRef = useRef(false);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setTimeout(() => setCooldown(value => Math.max(0, value - 1)), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  useEffect(() => {
    if (linkOpen) linkInputRef.current?.focus();
  }, [linkOpen]);

  const trimmedLink = linkInput.trim();
  const linkCandidate = isValidHttpUrl(trimmedLink) ? trimmedLink : '';
  const hasLinkImage = Boolean(linkCandidate);
  const hasValidImage =
    Boolean(file) ||
    (hasLinkImage && linkStatus === 'ok' && Boolean(linkUrl));
  const linkNotReady =
    hasLinkImage && !(linkStatus === 'ok' && Boolean(linkUrl));

  function clearLink() {
    setLinkOpen(false);
    setLinkInput('');
    setLinkUrl('');
    setLinkStatus('idle');
    setLinkError('');
  }

  function handlePickImage(event) {
    const selected = event.target.files?.[0];
    event.target.value = '';
    if (!selected) return;

    setError('');
    if (!ALLOWED_IMAGE_TYPES.includes(selected.type)) {
      setError('Faqat JPG, PNG yoki WEBP formatdagi rasm yuklash mumkin.');
      return;
    }
    if (selected.size > MAX_IMAGE_SIZE) {
      setError('Rasm hajmi 5 MB dan oshmasligi kerak.');
      return;
    }

    if (linkOpen) clearLink();
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  function handleLinkChange(event) {
    const value = event.target.value;
    setLinkInput(value);
    setLinkUrl('');
    setLinkStatus('idle');
    setLinkError('');

    const trimmed = value.trim();
    if (!trimmed) return;

    if (!/^https?:\/\//i.test(trimmed)) {
      setLinkError('Havola http:// yoki https:// bilan boshlanishi kerak.');
      return;
    }
    if (!isValidHttpUrl(trimmed)) {
      setLinkError('Havolani tekshiring.');
      return;
    }

    setLinkStatus('loading');
  }

  function handleLinkLoaded() {
    if (!linkCandidate) return;
    setLinkUrl(linkCandidate);
    setLinkStatus('ok');
    setLinkError('');
  }

  function handleLinkFailed() {
    setLinkUrl('');
    setLinkStatus('error');
    setLinkError('');
  }

  function handleRemoveImage() {
    setFile(null);
    setPreview('');
    setLinkInput('');
    setLinkUrl('');
    setLinkStatus('idle');
    setLinkError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function resetComposer() {
    setText('');
    setFile(null);
    setPreview('');
    setError('');
    setUploadPercent(null);
    clearLink();
    setExpanded(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitLockRef.current || blocked) return;

    const value = text.trim();
    if (!value && !hasValidImage) {
      setError("Post matni yoki rasm qo'shing.");
      return;
    }
    if (value.length > POST_TEXT_LIMIT) {
      setError(`Matn ${POST_TEXT_LIMIT} belgidan oshmasligi kerak.`);
      return;
    }
    if (cooldown > 0) return;
    if (linkNotReady) {
      setError('Rasm yuklanmadi, havolani tekshiring');
      return;
    }

    submitLockRef.current = true;
    setSubmitting(true);
    setError('');

    try {
      let imageUrl = '';
      if (file) {
        setUploadPercent(0);
        imageUrl = await uploadImage(file, setUploadPercent);
      } else if (hasValidImage) {
        imageUrl = linkUrl;
      }

      const created = await createPost({
        authorId: user.id,
        name: displayName(user),
        avatar: '',
        text: value,
        image: imageUrl,
      });

      try {
        localStorage.setItem(cooldownKey(user?.id), String(Date.now()));
      } catch {
        // localStorage mavjud bo'lmasa jim o'tamiz
      }
      setCooldown(COOLDOWN_SECONDS);
      resetComposer();
      onCreated(created);
    } catch (err) {
      setError(err.message || 'Postni joylashda xatolik yuz berdi.');
    } finally {
      submitLockRef.current = false;
      setSubmitting(false);
      setUploadPercent(null);
    }
  }

  const isEmpty = !text.trim() && !hasValidImage;
  const submitDisabled =
    submitting || isEmpty || cooldown > 0 || blocked || linkNotReady;

  return (
    <Card className="blog-composer">
      <CardBody>
        {!expanded ? (
          <button
            type="button"
            className="blog-composer-trigger"
            onClick={() => setExpanded(true)}
            disabled={blocked}
          >
            <Avatar name={displayName(user)} size="md" />
            <span>
              {blocked
                ? 'Akkaunt bloklangan — post yozib bo‘lmaydi'
                : "Bugun nimani o'rgandingiz?"}
            </span>
          </button>
        ) : (
          <form className="blog-composer-form" onSubmit={handleSubmit}>
            <div className="blog-composer-top">
              <Avatar name={displayName(user)} size="md" />
              <span className="blog-composer-user">{displayName(user)}</span>
            </div>

            <textarea
              className="blog-composer-textarea"
              maxLength={POST_TEXT_LIMIT}
              placeholder="Bugun nimani o'rgandingiz?"
              value={text}
              onChange={event => setText(event.target.value)}
              disabled={submitting || blocked}
              autoFocus
            />

            <div className="blog-composer-meta">
              <span
                className={[
                  'blog-composer-counter',
                  text.length >= POST_TEXT_LIMIT ? 'over' : '',
                ].join(' ')}
              >
                {text.length}/{POST_TEXT_LIMIT}
              </span>
            </div>

            {linkOpen && (
              <div className="blog-composer-link-row">
                <input
                  ref={linkInputRef}
                  type="text"
                  className="blog-composer-link-input"
                  placeholder="Rasm havolasini kiriting (https://...)"
                  value={linkInput}
                  onChange={handleLinkChange}
                  disabled={submitting}
                  inputMode="url"
                />
              </div>
            )}

            {linkError && (
              <div className="blog-link-hint" role="alert">{linkError}</div>
            )}

            {preview && (
              <div className="blog-composer-preview">
                <img src={preview} alt="Tanlangan rasm" />
                <button
                  type="button"
                  className="blog-composer-preview-remove"
                  onClick={handleRemoveImage}
                  disabled={submitting}
                  aria-label="Rasmni olib tashlash"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            )}

            {!file && hasLinkImage && (
              <div className="blog-composer-preview">
                {linkStatus === 'error' ? (
                  <div className="blog-composer-preview-failed">
                    Rasm yuklanmadi, havolani tekshiring
                  </div>
                ) : (
                  <img
                    src={linkCandidate}
                    alt="Havoladagi rasm"
                    onLoad={handleLinkLoaded}
                    onError={handleLinkFailed}
                  />
                )}
                <button
                  type="button"
                  className="blog-composer-preview-remove"
                  onClick={handleRemoveImage}
                  disabled={submitting}
                  aria-label="Rasmni olib tashlash"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            )}

            {uploadPercent !== null && (
              <ProgressBar value={uploadPercent} max={100} label="Rasm yuklanmoqda" />
            )}

            {error && <div className="blog-form-error" role="alert">{error}</div>}

            <div className="blog-composer-actions">
              <div className="blog-composer-attach">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  hidden
                  onChange={handlePickImage}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={submitting || hasLinkImage}
                >
                  <ImagePlus size={16} />
                  Rasm
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setLinkOpen(true)}
                  disabled={submitting || Boolean(file)}
                >
                  <Link2 size={16} />
                  Havola
                </Button>
              </div>

              <div className="blog-composer-actions-right">
                {cooldown > 0 && (
                  <span className="blog-composer-cooldown">Yana {cooldown}s</span>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={resetComposer}
                  disabled={submitting}
                >
                  Bekor qilish
                </Button>
                <Button type="submit" variant="accent" size="sm" disabled={submitDisabled}>
                  {submitting ? 'Joylanmoqda...' : 'Joylash'}
                </Button>
              </div>
            </div>
          </form>
        )}
      </CardBody>
    </Card>
  );
}
