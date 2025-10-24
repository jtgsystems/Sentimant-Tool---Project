"use client"

interface KeywordTallyProps {
  tallies: Record<string, Record<string, { count: number; lines: number[] }>>
}

export default function KeywordTally({ tallies }: KeywordTallyProps) {
  // Get categories with at least one keyword detected
  const categoriesWithKeywords = Object.entries(tallies).filter(([, words]) => Object.keys(words).length > 0)

  if (categoriesWithKeywords.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No keywords detected</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categoriesWithKeywords.map(([category, words]) => (
        <div key={category} className="space-y-2">
          <h3 className={`font-semibold ${getCategoryColor(category)}`}>{category} Keywords:</h3>
          <ul className="space-y-1">
            {Object.entries(words)
              .sort(([, dataA], [, dataB]) => {
                // Sort by count (descending)
                return dataB.count - dataA.count
              })
              .map(([word, data]) => (
                <li key={word} className="flex justify-between items-center text-sm">
                  <span className="font-medium mr-2">
                    {word}: {data.count}
                  </span>
                  <span className="text-gray-600 text-xs">Lines: {data.lines.sort((a, b) => a - b).join(", ")}</span>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
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
