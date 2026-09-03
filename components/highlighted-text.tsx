"use client"

interface HighlightedTextProps {
  lines: {
    text: string
    lineNumber: number
    highlights: {
      word: string
      index: number
      category: string
    }[]
  }[]
}

export default function HighlightedText({ lines }: HighlightedTextProps) {
  if (lines.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No text analyzed</p>
  }

  return (
    <div className="font-mono text-sm whitespace-pre-wrap">
      {lines.map((line, lineIndex) => (
        <div key={lineIndex} className="mb-1">
          <span className="text-gray-500 mr-2 inline-block w-8 text-right">{line.lineNumber}:</span>
          <HighlightedLine text={line.text} highlights={line.highlights} />
        </div>
      ))}
    </div>
  )
}

function HighlightedLine({
  text,
  highlights,
}: {
  text: string
  highlights: { word: string; index: number; category: string }[]
}) {
  if (!text) return null

  if (highlights.length === 0) {
    return <span>{text}</span>
  }

  // Split the text into words
  const words = text.split(/(\s+)/)

  // Create an array to track which words should be highlighted
  const highlightMap = new Array(words.length).fill(null)

  // Map highlights to the correct indices
  let wordIndex = 0
  for (let i = 0; i < words.length; i++) {
    if (words[i].trim() !== "") {
      // This is a word, not whitespace
      const highlight = highlights.find((h) => h.index === wordIndex)
      if (highlight) {
        highlightMap[i] = highlight.category
      }
      wordIndex++
    }
  }

  return (
    <span>
      {words.map((word, index) => {
        const category = highlightMap[index]
        if (category) {
          return (
            <span key={index} className={`${getCategoryColor(category)} font-semibold`}>
              {word}
            </span>
          )
        }
        return <span key={index}>{word}</span>
      })}
    </span>
  )
}

function getCategoryColor(category: string) {
  const colorMapping: Record<string, string> = {
    Positive: "text-green-600",
    Negative: "text-red-600",
    Confused: "text-yellow-600",
    Excited: "text-orange-600",
    Neutral: "text-gray-600",
    Angry: "text-purple-600",
    Sad: "text-blue-600",
    Fearful: "text-indigo-600",
    Surprised: "text-pink-600",
    Disgusted: "text-teal-600",
    Trustful: "text-green-700",
    Anticipative: "text-blue-700",
    Bored: "text-gray-700",
    Proud: "text-indigo-700",
    Hopeful: "text-teal-700",
    Lonely: "text-blue-800",
    Relieved: "text-green-800",
    Frustrated: "text-red-700",
    Enthralled: "text-purple-700",
    Embarrassed: "text-pink-700",
    Indignant: "text-red-800",
    Content: "text-yellow-700",
  }
  return colorMapping[category] || "text-black"
}
