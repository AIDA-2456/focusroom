import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDueTerms } from '../utils/spacedRepetition';
import TutorChat from './TutorChat';

const HEADLINES = [
  "Your brain is capable of amazing things.",
  "One sentence. That's all. Let's go.",
  "No pressure. Just the next chunk.",
  "Distraction-free learning for ADHD students.",
  "Eyes on the goal. We handle the rest."
];

function Landing({ onStart, onStartAudioOnly, onStartReview }) {
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [dueCount, setDueCount] = useState(0);
  const [showTutor, setShowTutor] = useState(false);

  useEffect(() => {
    setDueCount(getDueTerms().length);
    const interval = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % HEADLINES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing">
      <div className="container">
        <motion.div 
          className="landing-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div className="logo" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <div className="logo-icon">🧠</div>
            <h1 className="logo-text">
              Focus<span className="gradient-text">Room</span>
            </h1>
          </motion.div>

          <div style={{ height: '3rem', position: 'relative', display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-xl)' }}>
            <AnimatePresence mode="wait">
              <motion.p 
                key={headlineIndex}
                className="tagline" 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                style={{ position: 'absolute', margin: 0 }}
              >
                {HEADLINES[headlineIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="features-marquee">
            <div className="features-track">
              {/* Original Set */}
              <div className="feature"><span className="feature-icon">✂️</span><span>Break content into focus-sized chunks</span></div>
              <div className="feature"><span className="feature-icon">🎯</span><span>One sentence at a time. Zero distractions.</span></div>
              <div className="feature"><span className="feature-icon">🔊</span><span>Read aloud with word highlighting</span></div>
              <div className="feature"><span className="feature-icon">⏱️</span><span>Built-in Pomodoro timer</span></div>
              {/* Duplicated Set for infinite loop */}
              <div className="feature"><span className="feature-icon">✂️</span><span>Break content into focus-sized chunks</span></div>
              <div className="feature"><span className="feature-icon">🎯</span><span>One sentence at a time. Zero distractions.</span></div>
              <div className="feature"><span className="feature-icon">🔊</span><span>Read aloud with word highlighting</span></div>
              <div className="feature"><span className="feature-icon">⏱️</span><span>Built-in Pomodoro timer</span></div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', marginBottom: 'var(--space-2xl)' }}>
            <motion.button className="btn btn-primary btn-lg" style={{ minWidth: '280px' }} onClick={onStart}>
              Start Focusing <span>→</span>
            </motion.button>
            
            {dueCount > 0 && (
              <motion.button 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="btn btn-secondary" 
                style={{ minWidth: '280px', border: '1px solid var(--accent-success)', color: 'var(--accent-success)', display: 'flex', justifyContent: 'center', gap: '8px' }}
                onClick={onStartReview}
              >
                <span>🧠</span> {dueCount} Review{dueCount > 1 ? 's' : ''} Due Today
              </motion.button>
            )}
          </div>

          <motion.div className="stats">
            <div className="stat">
              <div className="stat-value">20%</div>
              <div className="stat-label">of students have ADHD</div>
            </div>
            <div className="stat">
              <div className="stat-value">0</div>
              <div className="stat-label">distractions allowed</div>
            </div>
            <div className="stat">
              <div className="stat-value">100%</div>
              <div className="stat-label">focus achieved</div>
            </div>
          </motion.div>

          <motion.div className="problem-section" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}>
            <h2>What ADHD actually feels like</h2>
            <p className="problem-subtitle">An ADHD student doesn't just "get distracted." Their brain works differently in four key ways — and every single feature of FocusRoom maps directly to one of these core neurodivergent differences.</p>
            
            <div className="quote-cards">
              <div className="quote-card">
                <p className="quote-text">"When I look at a giant wall of textbook text, my brain literally just shuts down before I even read a word. It's physical."</p>
                <div className="quote-author">— Sarah, University Student</div>
                <div className="solution-badge">✨ Fixed by: Focus-Sized Chunks</div>
              </div>
              <div className="quote-card">
                <p className="quote-text">"I can read the same sentence five times and have zero idea what it said because my internal monologue is louder than the book."</p>
                <div className="quote-author">— James, High School Senior</div>
                <div className="solution-badge">🎧 Fixed by: Audio-Only Mode</div>
              </div>
              <div className="quote-card">
                <p className="quote-text">"I don't feel time. Three hours can pass in a blink, or 10 minutes can feel like a prison sentence."</p>
                <div className="quote-author">— Elena, Graduate Student</div>
                <div className="solution-badge">⏱️ Fixed by: Pomodoro Timer</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="bg-decoration decoration-1"></div>
      <div className="bg-decoration decoration-2"></div>

      {/* Floating Chat Button */}
      {!showTutor && (
        <button 
          onClick={() => setShowTutor(true)}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--gradient-main)',
            border: 'none',
            color: 'white',
            fontSize: '1.8rem',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-neon)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 90
          }}
        >
          💬
        </button>
      )}

      <AnimatePresence>
        {showTutor && (
          <TutorChat 
            activeChunk={{ text: "I am an ADHD student about to start a study session. Act as an encouraging study coach. Help me get motivated or answer general questions about focusing and studying with ADHD." }} 
            onClose={() => setShowTutor(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Landing;
