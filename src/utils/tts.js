class ChineseTTS {
  constructor() {
    this.synthesis = window.speechSynthesis
    this.voices = []
    this.ready = false

    // Load voices (async in some browsers)
    this.loadVoices()
    if (this.synthesis && this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = () => this.loadVoices()
    }
  }

  loadVoices() {
    if (!this.synthesis) return

    this.voices = this.synthesis.getVoices()
    const chineseVoices = this.voices.filter(v =>
      v.lang.startsWith('zh-CN') || v.lang.startsWith('zh')
    )
    this.ready = chineseVoices.length > 0
  }

  speak(text, options = {}) {
    if (!this.synthesis) return false

    // Cancel any ongoing speech
    this.synthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-CN'
    utterance.rate = options.rate || 0.8 // Slower for learning
    utterance.pitch = options.pitch || 1

    // Try to find a Chinese voice
    const chineseVoice = this.voices.find(v =>
      v.lang.startsWith('zh-CN') || v.lang.startsWith('zh')
    )

    if (chineseVoice) {
      utterance.voice = chineseVoice
    }

    this.synthesis.speak(utterance)
    return true
  }

  isSupported() {
    return 'speechSynthesis' in window
  }

  hasChineseVoice() {
    return this.ready
  }
}

// Create singleton instance
export const tts = new ChineseTTS()

// Convenience function
export const speakChinese = (text, options) => tts.speak(text, options)
