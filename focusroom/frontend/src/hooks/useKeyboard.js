import { useEffect } from 'react';

export function useKeyboard(handlers) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft' && handlers.onPrevious) {
        handlers.onPrevious();
      } else if (event.key === 'ArrowRight' && handlers.onNext) {
        handlers.onNext();
      } else if (event.key === ' ' && handlers.onSpace) {
        event.preventDefault();
        handlers.onSpace();
      } else if (event.key === 'Escape' && handlers.onEscape) {
        handlers.onEscape();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}
