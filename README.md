# 拼大人 Pindarin

A retro-styled Mandarin Chinese vocabulary trainer featuring HSK 1-3 vocabulary (4,000+ words) with an 8-bit Chinese aesthetic.

## Features

- **Pre-loaded HSK Vocabulary**: Complete HSK levels 1-3 with over 4,000 vocabulary cards
- **Randomized Learning**: Cards are shuffled every time you study a deck
- **Text-to-Speech**: Built-in browser-based Chinese pronunciation for every word
- **8-bit Chinese Theme**: Retro game aesthetic with traditional Chinese color palette (red, gold, jade, ink black)
- **Simple Progress**: Mark cards as mastered to remove them from future sessions
- **Custom Decks**: Create your own vocabulary decks alongside pre-loaded HSK content
- **Offline First**: Works without internet after initial load

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pindarin.git
cd pindarin
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

## Browser Requirements

For the best experience, use a modern browser with Chinese TTS support:
- **Chrome/Edge**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support (macOS 14.1+)

**Note**: Text-to-speech requires Chinese language voice packs installed on your system. Most modern operating systems include these by default.

## How to Use

### Studying Flashcards

1. Select a deck (HSK 1, HSK 2, or HSK 3) from the main screen
2. Click "Study Now" to begin - cards are randomized each session
3. View the Chinese character, then click the card to flip and reveal pinyin and English translation
4. Click the speaker icon (🔊) to hear native Chinese pronunciation
5. Choose what to do with the card:
   - **Next**: Move to the next card without marking
   - **Skip**: Skip this card for now (shown again at end of session)
   - **Mastered**: You've learned this word - won't appear in future sessions

### Managing Decks

1. Click "Manage Decks" in the navigation bar
2. Create new custom decks or edit existing ones
3. Add vocabulary cards with Chinese characters, pinyin, and English translations
4. Use the 🔊 Test button to preview pronunciation while editing

## Tech Stack

- React 18
- Vite 6
- Web Speech API (Chinese TTS)
- LocalStorage (data persistence)

## Data Attribution

HSK vocabulary data sourced from [drkameleon/complete-hsk-vocabulary](https://github.com/drkameleon/complete-hsk-vocabulary) (MIT License).

## Building for Production

```bash
npm run build
```

The production build will be available in the `dist/` directory.

## Preview Production Build

```bash
npm run preview
```

## License

MIT License
