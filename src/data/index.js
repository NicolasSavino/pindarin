import hsk1Cards from './hsk1.json'
import hsk2Cards from './hsk2.json'
import hsk3Cards from './hsk3.json'

export const HSK_DECKS = [
  {
    id: 'hsk-1',
    name: 'HSK 1',
    cards: hsk1Cards,
    isDefault: true
  },
  {
    id: 'hsk-2',
    name: 'HSK 2',
    cards: hsk2Cards,
    isDefault: true
  },
  {
    id: 'hsk-3',
    name: 'HSK 3',
    cards: hsk3Cards,
    isDefault: true
  }
]
