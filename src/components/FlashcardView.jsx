import { useState, useEffect } from 'react'
import './FlashcardView.css'
import { calculateNextReview, getDueCards, getDeckStats } from '../utils/supermemo'
import { speakChinese } from '../utils/tts'

function FlashcardView({ deck, onUpdateDeck, onExit }) {
  const [dueCards, setDueCards] = useState([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [stats, setStats] = useState({})

  useEffect(() => {
    const due = getDueCards(deck.cards)
    setDueCards(due)
    setStats(getDeckStats(deck.cards))
  }, [deck])

  const currentCard = dueCards[currentCardIndex]

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleGrade = (grade) => {
    const updatedCard = calculateNextReview(currentCard, grade)

    const updatedCards = deck.cards.map(card =>
      card.id === currentCard.id ? updatedCard : card
    )

    onUpdateDeck({ ...deck, cards: updatedCards })

    // Move to next card
    if (currentCardIndex < dueCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setIsFlipped(false)
    } else {
      setShowResult(true)
    }
  }

  const playAudio = () => {
    if (currentCard?.chinese) {
      speakChinese(currentCard.chinese)
    }
  }

  if (dueCards.length === 0) {
    return (
      <div className="flashcard-view">
        <div className="session-complete">
          <h2>All done for now!</h2>
          <p>No cards are due for review.</p>
          <div className="stats-summary">
            <div className="stat">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total Cards</span>
            </div>
            <div className="stat">
              <span className="stat-value">{stats.mature}</span>
              <span className="stat-label">Mature</span>
            </div>
            <div className="stat">
              <span className="stat-value">{stats.learning}</span>
              <span className="stat-label">Learning</span>
            </div>
          </div>
          <button onClick={onExit} className="btn-primary">
            Back to Decks
          </button>
        </div>
      </div>
    )
  }

  if (showResult) {
    return (
      <div className="flashcard-view">
        <div className="session-complete">
          <h2>Session Complete!</h2>
          <p>You've reviewed {dueCards.length} cards.</p>
          <button onClick={onExit} className="btn-primary">
            Back to Decks
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flashcard-view">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${((currentCardIndex + 1) / dueCards.length) * 100}%` }}
        />
      </div>

      <div className="card-counter">
        {currentCardIndex + 1} / {dueCards.length}
      </div>

      <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <div className="card-content">
              <div className="chinese">{currentCard.chinese}</div>
              <button
                className="audio-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  playAudio()
                }}
              >
                🔊
              </button>
              <div className="hint">Click to reveal</div>
            </div>
          </div>

          <div className="flashcard-back">
            <div className="card-content">
              <div className="chinese">{currentCard.chinese}</div>
              <div className="pinyin">{currentCard.pinyin}</div>
              <div className="english">{currentCard.english}</div>
              <button
                className="audio-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  playAudio()
                }}
              >
                🔊
              </button>
            </div>
          </div>
        </div>
      </div>

      {isFlipped && (
        <div className="grade-buttons">
          <p className="grade-prompt">How well did you know this?</p>
          <div className="grade-grid">
            <button
              className="grade-btn grade-0"
              onClick={() => handleGrade(0)}
            >
              Again
              <span className="grade-desc">Complete blackout</span>
            </button>
            <button
              className="grade-btn grade-3"
              onClick={() => handleGrade(3)}
            >
              Hard
              <span className="grade-desc">Difficult recall</span>
            </button>
            <button
              className="grade-btn grade-4"
              onClick={() => handleGrade(4)}
            >
              Good
              <span className="grade-desc">Correct with hesitation</span>
            </button>
            <button
              className="grade-btn grade-5"
              onClick={() => handleGrade(5)}
            >
              Easy
              <span className="grade-desc">Perfect recall</span>
            </button>
          </div>
        </div>
      )}

      <button className="exit-btn" onClick={onExit}>
        Exit Session
      </button>
    </div>
  )
}

export default FlashcardView
