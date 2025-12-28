/**
 * SuperMemo-2 algorithm implementation for spaced repetition
 *
 * @param {Object} card - The flashcard object
 * @param {number} grade - Quality of recall (0-5)
 *   5: Perfect response
 *   4: Correct response after hesitation
 *   3: Correct response with difficulty
 *   2: Incorrect response; correct answer seemed easy to recall
 *   1: Incorrect response; correct answer seemed familiar
 *   0: Complete blackout
 *
 * @returns {Object} Updated card with new scheduling parameters
 */
export const calculateNextReview = (card, grade) => {
  let { interval, repetition, easeFactor } = card

  if (grade >= 3) {
    // Correct response
    if (repetition === 0) {
      interval = 1
    } else if (repetition === 1) {
      interval = 6
    } else {
      interval = Math.round(interval * easeFactor)
    }
    repetition += 1
  } else {
    // Incorrect response - reset
    repetition = 0
    interval = 1
  }

  // Update ease factor
  easeFactor = easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))

  // Ease factor should not fall below 1.3
  if (easeFactor < 1.3) {
    easeFactor = 1.3
  }

  // Calculate next due date
  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + interval)

  return {
    ...card,
    interval,
    repetition,
    easeFactor,
    dueDate: dueDate.toISOString()
  }
}

/**
 * Get cards that are due for review
 * @param {Array} cards - Array of flashcards
 * @returns {Array} Cards that are due or overdue
 */
export const getDueCards = (cards) => {
  const now = new Date()
  return cards.filter(card => new Date(card.dueDate) <= now)
}

/**
 * Get statistics for a deck
 * @param {Array} cards - Array of flashcards
 * @returns {Object} Statistics object
 */
export const getDeckStats = (cards) => {
  const now = new Date()
  const dueCards = cards.filter(card => new Date(card.dueDate) <= now)
  const newCards = cards.filter(card => card.repetition === 0)
  const learningCards = cards.filter(card => card.repetition > 0 && card.repetition < 3)
  const matureCards = cards.filter(card => card.repetition >= 3)

  return {
    total: cards.length,
    due: dueCards.length,
    new: newCards.length,
    learning: learningCards.length,
    mature: matureCards.length
  }
}
