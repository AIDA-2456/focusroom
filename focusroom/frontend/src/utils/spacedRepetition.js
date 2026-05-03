// simple spaced repetition using localStorage
const SR_KEY = 'focusroom_spaced_repetition';

export const saveTermsToReview = (terms) => {
  const existing = getTermsToReview();
  const now = Date.now();
  
  // Basic SRS levels: 1 = tomorrow, 2 = 3 days, 3 = 7 days
  terms.forEach(term => {
    if (!existing.find(t => t.word === term)) {
      existing.push({
        id: Math.random().toString(36).substr(2, 9),
        word: term,
        level: 0,
        nextReview: now, // Due immediately first time
      });
    }
  });

  localStorage.setItem(SR_KEY, JSON.stringify(existing));
};

export const getTermsToReview = () => {
  try {
    return JSON.parse(localStorage.getItem(SR_KEY)) || [];
  } catch {
    return [];
  }
};

export const getDueTerms = () => {
  const terms = getTermsToReview();
  const now = Date.now();
  return terms.filter(t => t.nextReview <= now);
};

export const markTermReviewed = (id, remembered) => {
  const terms = getTermsToReview();
  const index = terms.findIndex(t => t.id === id);
  if (index === -1) return;

  const term = terms[index];
  const now = Date.now();

  if (remembered) {
    term.level += 1;
  } else {
    term.level = Math.max(0, term.level - 1);
  }

  // Calculate next review based on level
  // Level 0: 1 minute
  // Level 1: 1 day
  // Level 2: 3 days
  // Level 3: 7 days
  // Level 4: 14 days
  let delay = 60 * 1000; // default 1 min
  if (term.level === 1) delay = 24 * 60 * 60 * 1000;
  if (term.level === 2) delay = 3 * 24 * 60 * 60 * 1000;
  if (term.level === 3) delay = 7 * 24 * 60 * 60 * 1000;
  if (term.level >= 4) delay = 14 * 24 * 60 * 60 * 1000;

  term.nextReview = now + delay;
  localStorage.setItem(SR_KEY, JSON.stringify(terms));
};
