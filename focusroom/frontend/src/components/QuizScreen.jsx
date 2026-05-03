import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateQuiz } from '../services/api';

function QuizScreen({ originalText, onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    if (quizStarted) {
      const fetchQuiz = async () => {
        try {
          const result = await generateQuiz(originalText, 3);
          if (result.success && result.data.questions) {
            setQuestions(result.data.questions);
          } else {
            throw new Error('Could not generate quiz questions');
          }
        } catch (err) {
          console.error(err);
          setError('Failed to load quiz. Skipping knowledge check.');
          setTimeout(() => onComplete({ score: 0, total: 0 }), 3000);
        } finally {
          setLoading(false);
        }
      };

      fetchQuiz();
    }
  }, [originalText, quizStarted]);

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return; // Prevent double clicking
    setSelectedAnswer(index);
    setShowExplanation(true);

    if (index === questions[currentIndex].correctIndex) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      onComplete({ score, total: questions.length });
    }
  };

  if (!quizStarted) {
    return (
      <div className="hyperfocus-mode" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h2 style={{ marginBottom: '2rem' }}>Session Complete! 🎉</h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '500px', textAlign: 'center' }}>
          Would you like to take a quick Knowledge Check to lock in what you've learned? 
          It's completely optional and low-pressure!
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={() => onComplete({ score: 0, total: 0, skipped: true })}>
            Skip for now
          </button>
          <button className="btn btn-primary" onClick={() => setQuizStarted(true)}>
            Take Knowledge Check 🧠
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="hyperfocus-mode" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontSize: '3rem', animation: 'spin 1s linear infinite', marginBottom: '1rem' }}>🧠</div>
        <h2>Generating your Knowledge Check...</h2>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hyperfocus-mode" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h2 style={{ color: 'var(--accent-pink)' }}>Oops!</h2>
        <p>{error}</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctIndex;

  return (
    <div className="hyperfocus-mode" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${((currentIndex) / questions.length) * 100}%` }} />
      </div>
      <div className="progress-text" style={{ top: '3rem' }}>
        Question {currentIndex + 1} of {questions.length}
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIndex}
          className="glass-card"
          style={{ maxWidth: '800px', width: '100%', padding: '3rem', marginTop: '4rem' }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
        >
          <h2 style={{ marginBottom: '2rem', fontSize: '1.8rem', lineHeight: '1.4' }}>
            {currentQuestion.question}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {currentQuestion.options.map((option, idx) => {
              let btnClass = 'btn-secondary';
              if (selectedAnswer !== null) {
                if (idx === currentQuestion.correctIndex) btnClass = 'btn-primary';
                else if (idx === selectedAnswer) btnClass = 'btn-secondary'; // It was wrong
                else btnClass = 'btn-ghost';
              }

              return (
                <button 
                  key={idx}
                  className={`btn ${btnClass}`}
                  style={{ 
                    justifyContent: 'flex-start', 
                    padding: '1.5rem', 
                    fontSize: '1.2rem',
                    textAlign: 'left',
                    opacity: selectedAnswer !== null && idx !== currentQuestion.correctIndex && idx !== selectedAnswer ? 0.5 : 1,
                    border: selectedAnswer === idx && !isCorrect ? '2px solid var(--accent-pink)' : ''
                  }}
                  onClick={() => handleAnswer(idx)}
                  disabled={selectedAnswer !== null}
                >
                  <span style={{ marginRight: '1rem', opacity: 0.5 }}>{String.fromCharCode(65 + idx)}.</span>
                  {option}
                  {selectedAnswer !== null && idx === currentQuestion.correctIndex && ' ✅'}
                  {selectedAnswer === idx && !isCorrect && ' ❌'}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {showExplanation && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{ 
                  marginTop: '2rem', 
                  padding: '1.5rem', 
                  borderRadius: '12px',
                  background: isCorrect ? 'rgba(0, 240, 255, 0.1)' : 'rgba(255, 42, 109, 0.1)',
                  borderLeft: `4px solid ${isCorrect ? 'var(--accent-cyan)' : 'var(--accent-pink)'}`
                }}
              >
                <h4 style={{ color: isCorrect ? 'var(--accent-cyan)' : 'var(--accent-pink)', marginBottom: '0.5rem' }}>
                  {isCorrect ? 'Awesome!' : 'Not quite!'}
                </h4>
                <p style={{ margin: 0 }}>
                  {isCorrect ? currentQuestion.explanation : (currentQuestion.wrongExplanation || currentQuestion.explanation)}
                </p>
                
                <button 
                  className="btn btn-primary" 
                  style={{ marginTop: '1.5rem' }}
                  onClick={handleNext}
                >
                  {currentIndex < questions.length - 1 ? 'Next Question →' : 'See My Results 🏆'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default QuizScreen;
