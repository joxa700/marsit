// AIAssistant — floating chat widget styled as white circle with purple/blue gradient ring & sparkle icon
import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send } from 'lucide-react';
import { aiResponses } from '../../data/notifications';
import './AIAssistant.css';

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 0, role: 'bot', text: "Salom! Men Mars IT AI-yordamchisiman 🤖 Savolingiz bo'lsa bering!" },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  async function sendMessage() {
    const text = input.trim();
    if (!text) return;
    setInput('');
    const userMsg = { id: Date.now(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);
    // Simulate AI thinking
    await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
    const reply = aiResponses[Math.floor(Math.random() * aiResponses.length)];
    setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: reply }]);
    setTyping(false);
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  return (
    <>
      {/* Floating round AI button: white circle, purple/blue gradient ring, sparkle icon */}
      <button
        type="button"
        className="ai-fab"
        aria-label="Mars AI Yordamchi"
        onClick={() => setOpen(o => !o)}
        title="Mars AI Yordamchi"
      >
        <div className="ai-fab-ring">
          <div className="ai-fab-inner">
            <Sparkles size={24} className="ai-sparkle-icon" />
          </div>
        </div>
      </button>

      {/* Chat panel */}
      {open && (
        <div className="ai-panel" role="dialog" aria-label="Mars AI Yordamchi">
          <div className="ai-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="ai-header-icon-wrap">
                <Sparkles size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Mars AI</div>
                <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>● Onlayn</div>
              </div>
            </div>
            <button className="ai-close" onClick={() => setOpen(false)} aria-label="Yopish">
              <X size={18} />
            </button>
          </div>
          <div className="ai-messages">
            {messages.map(m => (
              <div key={m.id} className={['ai-msg', `ai-msg-${m.role}`].join(' ')}>
                {m.text}
              </div>
            ))}
            {typing && (
              <div className="ai-msg ai-msg-bot">
                <span className="ai-typing"><span /><span /><span /></span>
              </div>
            )}
            <div ref={endRef} />
          </div>
          <div className="ai-input-wrap">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Savolingizni yozing..."
              aria-label="Xabarni kiriting"
              autoFocus
            />
            <button
              className="ai-send-btn"
              onClick={sendMessage}
              disabled={!input.trim() || typing}
              aria-label="Yuborish"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

