export type SentimentCategoryMap = Record<string, string>

export type Highlight = { word: string; index: number; category: string }

export type AnalyzeResult ={
  lines: { text: string; lineNumber: number; highlights: Highlight[] }[]
  wordCount: number
  charCount: number
  sentimentScore: number
  sentimentCounts: Record<string, number>
  keywordTallies: Record<string, Record<string, { count: number; lines: number[] }>>
  paragraphsWithKeywords: string[]
}

function getSentimentScore(category: string): number {

    const scoreMapping: Record<string, number> = {
      Positive: 1,
      Negative: -1,
      Confused: -0.2,
      Excited: 1,
      Neutral: 0,
      Angry: -1,
      Sad: -1,
      Fearful: -0.8,
      Surprised: 0.5,
      Disgusted: -0.7,
      Trustful: 1,
      Anticipative: 0.8,
      Bored: -0.3,
      Proud: 1,
      Hopeful: 0.9,
      Lonely: -0.5,
      Relieved: 0.7,
      Frustrated: -0.6,
      Enthralled: 0.8,
      Embarrassed: -0.4,
      Indignant: -0.7,
      Content: 0.6,
    }
    return scoreMapping[category] || 0
}

export function analyzeSentiment(
  text: string,
  sentimentCategories: SentimentCategoryMap,
): AnalyzeResult {

    const lines = text.split(/\r?\n/)
    let totalWordCount = 0
    const newSentimentCounts: Record<string, number> = {}
    const newKeywordTallies: Record<string, Record<string, { count: number; lines: number[] }>> = {}
    const newOutput: { text: string; lineNumber: number; highlights: Highlight[] }[] = []

    // Initialize counts and tallies
    Object.keys(sentimentCategories).forEach((category) => {
      newSentimentCounts[category] = 0
      newKeywordTallies[category] = {}
    })

    // Process paragraphs for context
    const paragraphs = text.split(/\r?\n\s*\r?\n/).filter((p) => p.trim().length > 0)
    const paragraphKeywordFound = Array(paragraphs.length).fill(false)
    let currentParagraphIndex = 0
    let lineCounterForParagraphs = 0

    // Process each line
    lines.forEach((line, lineIndex) => {
      const lineNumber = lineIndex + 1
      const words = line.split(/\s+/).filter((word) => word.length > 0)
      totalWordCount += words.length

      // Track paragraphs
      if (
        line.trim() === "" &&
        lineCounterForParagraphs > 0 &&
        lines[lineIndex - 1] &&
        lines[lineIndex - 1].trim() !== ""
      ) {
        currentParagraphIndex++
      }

      const lineHighlights: Highlight[] = []

      // Process each word
      words.forEach((word, wordIndex) => {
        const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").toLowerCase()

        // Check against keywords in each category
        for (const category in sentimentCategories) {
          const keywords = sentimentCategories[category].split(",").map((k) => k.trim())

          if (keywords.includes(cleanWord)) {
            newSentimentCounts[category]++

            // Update tally
            if (!newKeywordTallies[category][cleanWord]) {
              newKeywordTallies[category][cleanWord] = { count: 0, lines: [] }
            }
            newKeywordTallies[category][cleanWord].count++
            if (!newKeywordTallies[category][cleanWord].lines.includes(lineNumber)) {
              newKeywordTallies[category][cleanWord].lines.push(lineNumber)
            }

            // Add highlight
            lineHighlights.push({
              word,
              index: wordIndex,
              category,
            })

            // Mark paragraph
            if (currentParagraphIndex < paragraphs.length) {
              paragraphKeywordFound[currentParagraphIndex] = true
            }

            break // Assign to first matching category only
          }
        }
      })

      newOutput.push({
        text: line,
        lineNumber,
        highlights: lineHighlights,
      })

      // Update line counter for paragraph tracking
      if (line.trim() !== "") {
        lineCounterForParagraphs++
      } else {
        lineCounterForParagraphs = 0
      }
    })

    // Calculate sentiment score
    let score = 0
    for (const category in newSentimentCounts) {
      score += newSentimentCounts[category] * getSentimentScore(category)
    }
  return {
    lines: newOutput,
    wordCount: totalWordCount,
    charCount: text.length,
    sentimentScore: score,
    sentimentCounts: newSentimentCounts,
    keywordTallies: newKeywordTallies,
    paragraphsWithKeywords: paragraphs.filter((_, index) => paragraphKeywordFound[index]),
  }
}
