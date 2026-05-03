import { motion } from 'framer-motion';
import { useSpeech } from '../hooks/useSpeech';
import CountUp from './CountUp';

function PreviewSettings({ content, chunks, settings, onSettingsChange, isReprocessing, onStart, onBack }) {
  const totalTime = content.metadata?.estimatedMinutes || 0;
  const chunkCount = chunks.length;
  const { prime } = useSpeech();

  const finishTime = new Date(Date.now() + totalTime * 60000);
  const formattedFinishTime = finishTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  const handleStart = () => {
    prime(); // Unlock audio context on user interaction
    onStart();
  };

  return (
    <div className="preview-settings-page">
      <div className="container">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <button className="btn btn-ghost" onClick={onBack}>← Back</button>

          <h2>Ready to focus</h2>
          
          <div className="preview-stats">
            <div className="stat-card">
              <span className="stat-icon">📄</span>
              <span className="stat-number"><CountUp end={chunkCount} /></span>
              <span className="stat-label">chunks</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">⏱️</span>
              <span className="stat-number">Done by {formattedFinishTime}</span>
              <span className="stat-label">total focus time: ~{totalTime}m</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🎯</span>
              <span className="stat-number"><CountUp end={settings.pomodoroWork} /></span>
              <span className="stat-label">min work</span>
            </div>
          </div>

          <div className="settings-panel glass-card">
            <h3>Settings</h3>
            
            <div className="setting-group">
              <label>Simplification</label>
              <div className="btn-group">
                <button className={`btn btn-sm ${settings.simplify === 'original' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => onSettingsChange({...settings, simplify: 'original'})}>
                  Original
                </button>
                <button className={`btn btn-sm ${settings.simplify === 'moderate' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => onSettingsChange({...settings, simplify: 'moderate'})}>
                  Moderate
                </button>
                <button className={`btn btn-sm ${settings.simplify === 'heavy' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => onSettingsChange({...settings, simplify: 'heavy'})}>
                  Plain English
                </button>
              </div>
            </div>

            <div className="setting-group">
              <label>
                <input 
                  type="checkbox" 
                  checked={settings.autoRead}
                  onChange={(e) => onSettingsChange({...settings, autoRead: e.target.checked})}
                />
                Read it to me
              </label>
            </div>

            <div className="setting-group">
              <label>Pomodoro: {settings.pomodoroWork} min work / {settings.pomodoroBreak} min break</label>
            </div>
          </div>

          <div className="preview-chunks">
            {isReprocessing ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '2rem', animation: 'spin 1s linear infinite', display: 'inline-block', marginBottom: '1rem' }}>⚙️</div>
                <h3>Simplifying content...</h3>
                <p className="text-muted">This takes a few seconds.</p>
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
              </div>
            ) : (
              <>
                <h3>Preview (first 3 chunks)</h3>
                {chunks.slice(0, 3).map(chunk => (
                  <div key={chunk.id} className="chunk-preview glass-card">
                    <span className="chunk-number">{chunk.id}</span>
                    <p>{chunk.text}</p>
                  </div>
                ))}
              </>
            )}
          </div>

          <button className="btn btn-primary btn-lg" onClick={handleStart} disabled={isReprocessing}>
            {isReprocessing ? 'Processing...' : 'Start Focus Session →'}
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default PreviewSettings;
