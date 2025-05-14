import { Info } from "lucide-react"

export default function UsageInstructions() {
  return (
    <div className="mx-auto mb-6 mt-4 w-full max-w-5xl rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-[#2c3e50] p-1.5 text-white">
          <Info className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-[#2c3e50]">How to Use This Tool</h2>
          <ol className="ml-5 list-decimal space-y-1 text-sm text-gray-700">
            <li>
              <span className="font-medium">Paste your conversation</span> in the text area below
            </li>
            <li>
              <span className="font-medium">Customize keywords</span> in the "Keywords" tab (optional)
            </li>
            <li>
              Click <span className="font-medium">Analyze</span> to process the text
            </li>
            <li>
              View <span className="font-medium">results</span> showing sentiment distribution, highlighted keywords,
              and statistics
            </li>
          </ol>
          <p className="text-sm text-gray-600">
            The tool analyzes text for emotional keywords and provides a sentiment score. Positive emotions have
            positive scores, negative emotions have negative scores. Keywords are highlighted in the analyzed text.
          </p>
        </div>
      </div>
    </div>
  )
}
