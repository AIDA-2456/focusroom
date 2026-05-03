import { useState, useCallback, useRef } from 'react';

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef(null);

  const prime = useCallback(() => {
    // Prime the speech engine with an empty utterance to unlock it on user interaction
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance('');
      u.volume = 0;
      window.speechSynthesis.speak(u);
    }
  }, []);

  const speak = (text, options = {}) => {
    if (!text || !('speechSynthesis' in window)) return;

    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Customize voice settings
    utterance.rate = 0.9; // Slightly slower for better comprehension
    utterance.pitch = 1.0;
    
    // Find a good english voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Samantha')));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (e) => {
      console.error('[Speech] Synthesis failed:', e);
      setIsSpeaking(false);
      if (options.onEnd) options.onEnd(); // Auto-advance even if error
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
  };

  return { speak, stop, prime, isSpeaking, isPaused };
}
