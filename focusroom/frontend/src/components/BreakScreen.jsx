import { useTimer } from '../hooks/useTimer';
import { motion } from 'framer-motion';

function BreakScreen({ duration, onComplete }) {
  const { minutes, seconds } = useTimer(duration, onComplete);
  
  // Calculate progress percentage
  const totalSeconds = duration * 60;
  const remainingSeconds = minutes * 60 + seconds;
  const progressPercent = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;

  return (
    <div className="break-screen" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
      <motion.div 
        className="break-content glass-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={{ textAlign: 'center', padding: 'var(--space-2xl)', maxWidth: '600px', width: '90%' }}
      >
        <motion.h1 
          style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}
          animate={{ textShadow: ['0 0 10px rgba(0,240,255,0.5)', '0 0 30px rgba(0,240,255,0.8)', '0 0 10px rgba(0,240,255,0.5)'] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🎉 Break Time!
        </motion.h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>You've earned a {duration}-minute break. Step away from the screen.</p>
        
        <div style={{ position: 'relative', width: '250px', height: '250px', margin: '0 auto var(--space-2xl)' }}>
          <svg width="250" height="250" viewBox="0 0 250 250" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="125" cy="125" r="115" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
            <motion.circle 
              cx="125" cy="125" r="115" fill="none" stroke="var(--accent-cyan)" strokeWidth="10" 
              strokeDasharray={2 * Math.PI * 115}
              strokeDashoffset={2 * Math.PI * 115 * (1 - progressPercent / 100)}
              style={{ filter: 'drop-shadow(0 0 10px var(--accent-cyan))', transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', fontWeight: '800', fontFamily: 'monospace' }}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>

        <div className="break-activities" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: 'var(--space-2xl)' }}>
          <div className="activity glass-card" style={{ padding: '1rem', flex: 1 }}>🚶<br/>Walk</div>
          <div className="activity glass-card" style={{ padding: '1rem', flex: 1 }}>💧<br/>Hydrate</div>
          <div className="activity glass-card" style={{ padding: '1rem', flex: 1 }}>🧘<br/>Stretch</div>
        </div>

        <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={onComplete}>
          Skip Break & Continue <span>→</span>
        </button>
      </motion.div>
    </div>
  );
}

export default BreakScreen;
