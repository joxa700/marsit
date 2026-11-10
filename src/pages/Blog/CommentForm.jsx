import { useState } from 'react';
import { Send } from 'lucide-react';

export default function CommentForm({ onSubmit, disabled = false }) {
  const [value, setValue] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    const text = value.trim();
    if (!text || sending || disabled) return;

    setSending(true);
    setError('');
    try {
      await onSubmit(text);
      setValue('');
    } catch (err) {
      setError(err.message || "Izoh qo'shishda xatolik yuz berdi.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="blog-comment-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        maxLength={500}
        placeholder="Izoh yozing..."
        onChange={event => setValue(event.target.value)}
        disabled={disabled || sending}
        aria-label="Izoh matni"
      />
      <button
        type="submit"
        className="blog-comment-send"
        disabled={disabled || sending || !value.trim()}
        aria-label="Izoh yuborish"
      >
        <Send size={16} />
      </button>
      {error && <div className="blog-comment-error" role="alert">{error}</div>}
    </form>
  );
}
