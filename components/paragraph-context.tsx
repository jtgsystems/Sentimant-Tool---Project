"use client"

interface ParagraphContextProps {
  paragraphs: string[]
}

export default function ParagraphContext({ paragraphs }: ParagraphContextProps) {
  if (paragraphs.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No paragraphs with keywords detected</p>
  }

  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="border-l-4 pl-4 italic text-gray-700">
          {paragraph}
        </p>
      ))}
    </div>
  )
}
