import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { processContent, uploadPdf } from '../services/api';

function ContentInput({ settings, onSettingsChange, onContentReady, onBack, autoSimplifyNext }) {
  const [inputType, setInputType] = useState('text');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const exampleText = `The prefrontal cortex regulates executive function and impulse control in the human brain. This region, located at the front of the frontal lobe, is responsible for complex cognitive behaviors including decision-making, planning, and moderating social behavior. Research has shown that the prefrontal cortex doesn't fully develop until the mid-20s, which explains why adolescents often struggle with impulse control and long-term planning.`;

  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const result = await uploadPdf(file);
      if (result.success) {
        setInputType('text');
        setText(result.data.text);
      }
    } catch(err) {
      setError(err.response?.data?.message || 'Failed to extract text from PDF');
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      const payload = inputType === 'text' ? { text } : { url };
      // Enforce simplification if adaptive difficulty triggered it, otherwise use user settings
      payload.simplify = autoSimplifyNext ? 'moderate' : (settings.simplify === 'original' ? false : settings.simplify);
      
      const result = await processContent(payload);
      
      if (result.success) {
        onContentReady(result.data, payload);
      }
    } catch (err) {
      console.error("Full error:", err);
      setError(err.response?.data?.message || err.message || 'Failed to process content');
    } finally {
      setLoading(false);
    }
  };

  const useExample = () => {
    setInputType('text');
    setText(exampleText);
  };

  return (
    <div className="content-input-page">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <button className="btn btn-ghost" onClick={onBack}>← Back</button>
          
          <h2>What do you want to focus on?</h2>
          
          {autoSimplifyNext && (
            <div style={{ background: 'rgba(59, 130, 246, 0.15)', borderLeft: '4px solid var(--accent-cyan)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'left' }}>
              <p style={{ margin: 0 }}><strong>🧠 Adaptive Difficulty Enabled:</strong> We noticed the last quiz was a bit tough. We'll automatically translate this next session into <em>Plain English</em> to help you master it!</p>
            </div>
          )}
          
          <div className="segmented-control glass-card" style={{ padding: '4px', display: 'flex', gap: '4px', borderRadius: '12px', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem auto' }}>
            <button 
              className={`btn ${inputType === 'text' ? 'active-segment' : 'inactive-segment'}`}
              style={{ flex: 1, border: 'none', background: inputType === 'text' ? 'rgba(0, 240, 255, 0.15)' : 'transparent', color: inputType === 'text' ? '#fff' : 'var(--text-muted)' }}
              onClick={() => setInputType('text')}
            >
              📝 Paste Text
            </button>
            <button 
              className={`btn ${inputType === 'url' ? 'active-segment' : 'inactive-segment'}`}
              style={{ flex: 1, border: 'none', background: inputType === 'url' ? 'rgba(0, 240, 255, 0.15)' : 'transparent', color: inputType === 'url' ? '#fff' : 'var(--text-muted)' }}
              onClick={() => setInputType('url')}
            >
              🔗 Enter URL
            </button>
          </div>

          {inputType === 'text' ? (
            <div className="input-area">
              <textarea
                className="input"
                placeholder="Paste your lecture notes, textbook chapter, or any content you need to study..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={10}
              />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button className="btn btn-secondary btn-sm" onClick={useExample}>
                  Use example text
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  accept=".pdf" 
                  onChange={handleFileUpload} 
                />
                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                >
                  📄 Upload PDF
                </button>
              </div>
            </div>
          ) : (
            <div className="input-area">
              <input
                type="url"
                className="input"
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <p className="text-small text-muted">
                We'll extract the main content and remove distractions using BrowserPod
              </p>
            </div>
          )}

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', marginTop: 'var(--space-xl)' }}>
            <button 
              className="btn btn-primary btn-lg"
              onClick={handleSubmit}
              disabled={loading || (!text && !url)}
              style={{ width: '100%', maxWidth: '400px' }}
            >
              {loading ? 'Processing...' : 'Start Focusing'} →
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ContentInput;
