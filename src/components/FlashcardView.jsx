import { useState, useEffect } from 'react'
import './FlashcardView.css'
import { speakChinese } from '../utils/tts'

function FlashcardView({ deck, onUpdateDeck, onExit }) {
  const [cards, setCards] = useState([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [skippedCards, setSkippedCards] = useState([])

  useEffect(() => {
    // Get all non-mastered cards and randomize them
    const nonMastered = deck.cards.filter(card => !card.mastered)
    const shuffled = [...nonMastered].sort(() => Math.random() - 0.5)
    setCards(shuffled)
  }, [deck])

  const currentCard = cards[currentCardIndex]

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleNext = () => {
    moveToNextCard()
  }

  const handleSkip = () => {
    // Add current card to skipped list to show at end
    setSkippedCards([...skippedCards, currentCard])
    moveToNextCard()
  }

  const handleMastered = () => {
    // Mark card as mastered
    const updatedCard = { ...currentCard, mastered: true }
    const updatedCards = deck.cards.map(card =>
      card.id === currentCard.id ? updatedCard : card
    )
    onUpdateDeck({ ...deck, cards: updatedCards })
    moveToNextCard()
  }

  const moveToNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setIsFlipped(false)
    } else if (skippedCards.length > 0) {
      // Show skipped cards
      setCards(skippedCards)
      setSkippedCards([])
      setCurrentCardIndex(0)
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

  if (cards.length === 0) {
    return (
      <div className="flashcard-view">
        <div className="session-complete">
          <h2>All Mastered!</h2>
          <p>You've mastered all cards in this deck.</p>
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
          <p>Great work!</p>
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
          style={{ width: `${((currentCardIndex + 1) / cards.length) * 100}%` }}
        />
      </div>

      <div className="card-counter">
        {currentCardIndex + 1} / {cards.length}
      </div>

      <div className="card-container">
        <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
          <div className="flashcard-inner">
            <div className="flashcard-front">
              <div className="card-content">
                <div className="chinese">{currentCard.chinese}</div>
                <div className="pinyin">{currentCard.pinyin}</div>
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

        <div className={`grade-buttons ${isFlipped ? 'visible' : ''}`}>
          <div className="grade-grid">
            <button
              className="grade-btn btn-next"
              onClick={handleNext}
            >
              Next
            </button>
            <button
              className="grade-btn btn-skip"
              onClick={handleSkip}
            >
              Skip
            </button>
            <button
              className="grade-btn btn-mastered"
              onClick={handleMastered}
            >
              Mastered
            </button>
          </div>
        </div>
      </div>

      <button className="exit-btn" onClick={onExit}>
        Exit Session
      </button>
    </div>
  )
}

export default FlashcardView
