import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatWithTutor } from '../services/api';

function TutorChat({ activeChunk, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm your AI Tutor. Need help understanding this chunk? Ask me anything!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !activeChunk) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      // Pass the previous history so the tutor remembers the conversation
      const history = messages.slice(1); // skip initial greeting
      const result = await chatWithTutor(activeChunk.text, userMessage, history);
      
      if (result.success) {
        setMessages(prev => [...prev, { role: 'assistant', text: result.data.text }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I'm having trouble connecting right now. Let's try again in a moment!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="tutor-chat-container glass-card"
      style={{
        position: 'fixed',
        right: '20px',
        bottom: '80px',
        width: '350px',
        height: '500px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        zIndex: 100,
        boxShadow: 'var(--shadow-neon)'
      }}
    >
      <div style={{
        padding: '15px',
        background: 'rgba(0,0,0,0.2)',
        borderBottom: '1px solid var(--glass-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🧠</span> AI Tutor
        </h3>
        <button 
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}
        >×</button>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
            background: msg.role === 'user' ? 'var(--gradient-main)' : 'rgba(255,255,255,0.1)',
            padding: '10px 15px',
            borderRadius: msg.role === 'user' ? '15px 15px 0 15px' : '15px 15px 15px 0',
            fontSize: '0.95rem',
            lineHeight: 1.4,
            border: msg.role === 'user' ? 'none' : '1px solid var(--glass-border)'
          }}>
            {msg.text}
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: 'flex-start', padding: '10px 15px', background: 'rgba(255,255,255,0.05)', borderRadius: '15px', color: 'var(--text-muted)' }}>
            Thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} style={{
        padding: '15px',
        borderTop: '1px solid var(--glass-border)',
        display: 'flex',
        gap: '10px',
        background: 'rgba(0,0,0,0.2)'
      }}>
        <input 
          type="text" 
          className="input"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask a question..."
          style={{ padding: '8px 12px', fontSize: '0.95rem' }}
          disabled={loading}
        />
        <button 
          type="submit" 
          className="btn btn-primary"
          style={{ padding: '8px 15px' }}
          disabled={loading || !input.trim()}
        >
          ➤
        </button>
      </form>
    </motion.div>
  );
}

export default TutorChat;
