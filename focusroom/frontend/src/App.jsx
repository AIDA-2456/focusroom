import { useState } from 'react';
import Landing from './components/Landing';
import ContentInput from './components/ContentInput';
import PreviewSettings from './components/PreviewSettings';
import HyperfocusMode from './components/HyperfocusMode';
import BreakScreen from './components/BreakScreen';
import CompletionScreen from './components/CompletionScreen';
import BrainBackground from './components/BrainBackground';
import CursorSpotlight from './components/CursorSpotlight';
import QuizScreen from './components/QuizScreen';
import ThemeSwitcher from './components/ThemeSwitcher';
import SpacedRepetition from './components/SpacedRepetition';
import { saveTermsToReview } from './utils/spacedRepetition';

function App() {
  const [stage, setStage] = useState('landing');
  const [content, setContent] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [settings, setSettings] = useState({
    simplify: 'original',
    autoRead: true,
    audioOnly: false,
    pomodoroWork: 25,
    pomodoroBreak: 5
  });
  const [sessionData, setSessionData] = useState({
    chunksCompleted: 0,
    timeElapsed: 0,
    startTime: null
  });
  const [originalInput, setOriginalInput] = useState(null);
  const [isReprocessing, setIsReprocessing] = useState(false);
  const [autoSimplifyNext, setAutoSimplifyNext] = useState(false);

  const handleContentReady = (processedData, inputPayload) => {
    setChunks(processedData.chunks);
    setContent(processedData);
    if (inputPayload) setOriginalInput(inputPayload);
    setStage('preview');
  };

  const handleStartFocus = () => {
    setSessionData({ ...sessionData, startTime: Date.now() });
    setStage('focus');
  };

  const handleSettingsChange = async (newSettings) => {
    const oldSimplify = settings.simplify;
    setSettings(newSettings);

    if (newSettings.simplify !== oldSimplify && originalInput && stage === 'preview') {
      setIsReprocessing(true);
      try {
        const { processContent } = await import('./services/api');
        const payload = { ...originalInput, simplify: newSettings.simplify === 'original' ? false : newSettings.simplify };
        const result = await processContent(payload);
        if (result.success) {
          setChunks(result.data.chunks);
          setContent(result.data);
        }
      } catch (err) {
        console.error("Failed to reprocess:", err);
      } finally {
        setIsReprocessing(false);
      }
    }
  };

  const handleBreak = () => setStage('break');
  const handleBreakComplete = () => setStage('focus');
  
  const handleSessionComplete = (stats) => {
    setSessionData({ ...sessionData, ...stats });
    setStage('quiz');
  };

  const handleQuizComplete = (quizStats) => {
    setSessionData(prev => ({ ...prev, quizStats }));
    
    // Adaptive difficulty: if score is less than 2/3 (or 66%), turn on Plain English for next session
    if (quizStats && quizStats.score !== undefined && quizStats.total !== undefined) {
      if (quizStats.score < Math.ceil(quizStats.total * 0.66)) {
        setAutoSimplifyNext(true);
      } else {
        setAutoSimplifyNext(false);
      }
    }
    // Save keywords to Spaced Repetition
    if (chunks && chunks.length > 0) {
      const allKeywords = chunks.flatMap(c => c.keywords || []);
      const uniqueKeywords = [...new Set(allKeywords)];
      if (uniqueKeywords.length > 0) {
        saveTermsToReview(uniqueKeywords);
      }
    }

    setStage('complete');
  };

  const handleReset = () => {
    setStage('landing');
    setContent(null);
    setChunks([]);
    setSessionData({ chunksCompleted: 0, timeElapsed: 0, startTime: null });
  };

  return (
    <div className="app">
      <ThemeSwitcher />
      <CursorSpotlight />
      <BrainBackground />
      {stage === 'landing' && <Landing 
        onStart={() => setStage('input')} 
        onStartAudioOnly={() => {
          setSettings({ ...settings, audioOnly: true, autoRead: true });
          setStage('input');
        }}
        onStartReview={() => setStage('review')}
      />}
      {stage === 'review' && <SpacedRepetition onBack={() => setStage('landing')} />}
      {stage === 'input' && <ContentInput settings={settings} onSettingsChange={setSettings} onContentReady={handleContentReady} onBack={() => setStage('landing')} autoSimplifyNext={autoSimplifyNext} />}
      {stage === 'preview' && <PreviewSettings content={content} chunks={chunks} settings={settings} onSettingsChange={handleSettingsChange} isReprocessing={isReprocessing} onStart={handleStartFocus} onBack={() => setStage('input')} />}
      {stage === 'focus' && <HyperfocusMode chunks={chunks} settings={settings} onSettingsChange={setSettings} onBreak={handleBreak} onComplete={handleSessionComplete} />}
      {stage === 'break' && <BreakScreen duration={settings.pomodoroBreak} onComplete={handleBreakComplete} />}
      {stage === 'quiz' && <QuizScreen originalText={originalInput?.text || chunks.map(c => c.text).join(' ')} onComplete={handleQuizComplete} />}
      {stage === 'complete' && <CompletionScreen sessionData={sessionData} chunksText={originalInput?.text || chunks.map(c => c.text).join(' ')} onNewSession={handleReset} />}
    </div>
  );
}

export default App;
