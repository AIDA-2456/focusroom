import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDueTerms, markTermReviewed } from '../utils/spacedRepetition';

function SpacedRepetition({ onBack }) {
  const [dueTerms, setDueTerms] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setDueTerms(getDueTerms());
  }, []);

  const handleReview = (remembered) => {
    const term = dueTerms[currentIndex];
    markTermReviewed(term.id, remembered);
    
    setFlipped(false);
    if (currentIndex < dueTerms.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Done with all reviews
      setDueTerms([]);
    }
  };

  if (dueTerms.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '20vh' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉 All caught up!</h1>
        <p className="text-muted" style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
          You have no terms due for review right now.
        </p>
        <button className="btn btn-primary" onClick={onBack}>Return Home</button>
      </div>
    );
  }

  const currentTerm = dueTerms[currentIndex];
  const progress = ((currentIndex) / dueTerms.length) * 100;

  return (
    <div className="container" style={{ marginTop: '10vh' }}>
      <button className="btn btn-ghost" onClick={onBack} style={{ marginBottom: '2rem' }}>← Back</button>
      
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Daily Review</h2>
        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent-success)', transition: 'width 0.3s' }} />
        </div>
        <p className="text-muted" style={{ marginTop: '0.5rem' }}>{currentIndex + 1} of {dueTerms.length}</p>
      </div>

      <div style={{ perspective: '1000px', width: '100%', maxWidth: '600px', margin: '0 auto', height: '300px' }}>
        <motion.div
          animate={{ rotateX: flipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 20 }}
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
            cursor: 'pointer'
          }}
          onClick={() => !flipped && setFlipped(true)}
        >
          {/* Front */}
          <div className="glass-card" style={{
            position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
            boxShadow: 'var(--shadow-neon)'
          }}>
            <h3 style={{ fontSize: '3rem', margin: 0, textTransform: 'capitalize' }}>{currentTerm.word}</h3>
            <p className="text-muted" style={{ marginTop: '2rem', opacity: 0.7 }}>(Tap to flip)</p>
          </div>

          {/* Back */}
          <div className="glass-card" style={{
            position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
            transform: 'rotateX(180deg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
            background: 'var(--gradient-main)'
          }}>
            <h3 style={{ fontSize: '2rem', margin: 0, color: '#fff', textAlign: 'center', padding: '0 2rem' }}>
              Think of what this means in the context of your recent study sessions.
            </h3>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem', zIndex: 10 }}>
              <button 
                className="btn" 
                style={{ background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px' }}
                onClick={(e) => { e.stopPropagation(); handleReview(false); }}
              >
                Forgot ✕
              </button>
              <button 
                className="btn" 
                style={{ background: 'rgba(16, 185, 129, 0.9)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px' }}
                onClick={(e) => { e.stopPropagation(); handleReview(true); }}
              >
                Remembered ✓
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default SpacedRepetition;
