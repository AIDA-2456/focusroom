import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeech } from '../hooks/useSpeech';
import { useKeyboard } from '../hooks/useKeyboard';
import { useTimer } from '../hooks/useTimer';
import TutorChat from './TutorChat';

// Free CC0 public domain noise URLs
const SOUNDS = {
  none: '',
  brown: 'https://cdn.freesound.org/previews/140/140889_2548239-lq.mp3', // Brown noise
  rain: 'https://cdn.freesound.org/previews/200/200273_3558839-lq.mp3'  // Rain
};

function HyperfocusMode({ chunks, settings, onSettingsChange, onBreak, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [showTutor, setShowTutor] = useState(false);
  const [focusSound, setFocusSound] = useState('none');
  const audioRef = useRef(null);
  
  const { speak, stop, isSpeaking } = useSpeech();
  const { minutes, seconds: secs, totalSeconds, start, isActive } = useTimer(settings.pomodoroWork, onBreak);

  const currentChunk = chunks[currentIndex];
  const progress = ((currentIndex / chunks.length) * 100).toFixed(0);

  useEffect(() => {
    start();
  }, []);

  useEffect(() => {
    if (currentChunk && settings.autoRead) {
      speak(currentChunk.text, {
        onEnd: () => {
          setTimeout(() => {
            if (currentIndex < chunks.length - 1) {
              setCurrentIndex(currentIndex + 1);
            }
          }, 2000);
        }
      });
    }
  }, [currentIndex]);

  useEffect(() => {
    if (audioRef.current) {
      if (focusSound === 'none') {
        audioRef.current.pause();
      } else {
        audioRef.current.src = SOUNDS[focusSound];
        audioRef.current.volume = 0.2; // Keep it quiet
        audioRef.current.loop = true;
        audioRef.current.play().catch(e => console.log('Audio play failed:', e));
      }
    }
  }, [focusSound]);

  useKeyboard({
    onPrevious: () => {
      stop();
      if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    },
    onNext: () => {
      stop();
      if (currentIndex < chunks.length - 1) setCurrentIndex(currentIndex + 1);
      else onComplete({ chunksCompleted: chunks.length, timeElapsed: settings.pomodoroWork - minutes });
    },
    onSpace: () => {
      if (isSpeaking) {
        stop();
      } else {
        speak(currentChunk.text);
      }
    }
  });

  return (
    <div 
      className="hyperfocus-mode"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {!settings.audioOnly && (
        <>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-text">
            {currentIndex + 1} / {chunks.length}
          </div>
        </>
      )}
      
      <div className="timer">
        {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </div>

      <AnimatePresence mode="wait">
        {settings.audioOnly ? (
          <motion.div 
            key="audio-mode-indicator"
            className="chunk-display audio-only-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <div style={{ fontSize: '4rem', opacity: 0.2, animation: isSpeaking ? 'pulse 2s infinite alternate' : 'none' }}>🎧</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '1rem', opacity: 0.5 }}>
              Audio-Only Mode. Tap Space to Play/Pause. Right Arrow to Advance.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            key={currentIndex}
            className="chunk-display"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <p className="chunk-text">{currentChunk?.text}</p>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              {currentChunk?.keywords && currentChunk.keywords.length > 0 && (
                <div className="chunk-keywords">
                  {currentChunk.keywords.map((kw, i) => (
                    <span key={i} className="keyword-tag">{kw}</span>
                  ))}
                </div>
              )}
              
              <button 
                onClick={() => setShowTutor(!showTutor)}
                className="btn btn-secondary btn-sm"
                style={{ 
                  background: showTutor ? 'var(--gradient-main)' : 'rgba(138, 43, 226, 0.2)', 
                  border: '1px solid rgba(138, 43, 226, 0.4)',
                  padding: '4px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                💬 Ask AI Tutor
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTutor && (
          <TutorChat 
            activeChunk={currentChunk} 
            onClose={() => setShowTutor(false)} 
          />
        )}
      </AnimatePresence>

      <div className={`controls ${showControls ? 'visible' : ''}`}>
        {focusSound !== 'none' && (
          <audio ref={audioRef} />
        )}
        <select 
          className="btn btn-secondary" 
          value={focusSound} 
          onChange={(e) => setFocusSound(e.target.value)}
          style={{ marginRight: '10px' }}
        >
          <option value="none">🔇 No Sound</option>
          <option value="brown">📻 Brown Noise</option>
          <option value="rain">🌧️ Rain</option>
        </select>

        <button 
          className="btn btn-secondary" 
          onClick={() => onSettingsChange({...settings, audioOnly: !settings.audioOnly, autoRead: true})}
          style={{ marginRight: 'auto', border: settings.audioOnly ? '1px solid var(--accent-cyan)' : 'none' }}
        >
          🎧 Audio Mode: {settings.audioOnly ? 'ON' : 'OFF'}
        </button>
        <button className="btn btn-secondary" onClick={onBreak}>Pause / Break</button>
        <button className="btn btn-primary" onClick={onComplete}>End Session</button>
        
        <button 
          className="control-btn"
          onClick={() => {
            stop();
            if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
          }}
          disabled={currentIndex === 0}
        >
          ◀ Previous
        </button>

        <button 
          className="control-btn primary"
          onClick={() => {
            if (isSpeaking) {
              stop();
            } else {
              speak(currentChunk.text);
            }
          }}
        >
          {isSpeaking ? '⏸ Pause' : '▶ Read'}
        </button>

        <button 
          className="control-btn"
          onClick={() => {
            stop();
            if (currentIndex < chunks.length - 1) setCurrentIndex(currentIndex + 1);
            else onComplete({ chunksCompleted: chunks.length, timeElapsed: settings.pomodoroWork - minutes });
          }}
        >
          Next ▶
        </button>
      </div>

      <div className="keyboard-hints">
        <span>← Previous</span>
        <span>Space = Read</span>
        <span>→ Next</span>
      </div>
    </div>
  );
}

export default HyperfocusMode;
