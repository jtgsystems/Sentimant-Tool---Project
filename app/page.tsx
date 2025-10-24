"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Save, Upload, RefreshCw, X, Send } from "lucide-react"
import SentimentChart from "@/components/sentiment-chart"
import KeywordTally from "@/components/keyword-tally"
import HighlightedText from "@/components/highlighted-text"
import ParagraphContext from "@/components/paragraph-context"
import { defaultSentimentCategories } from "@/lib/sentiment-data"
import Topper from "@/components/topper"
import UsageInstructions from "@/components/usage-instructions"

interface Highlight {
  word: string
  index: number
  category: string
}

interface OutputLine {
  text: string
  lineNumber: number
  highlights: Highlight[]
}

/**
 * Main Sentiment Analyzer Component
 * Analyzes conversation text for sentiment using customizable keyword categories
 */
export default function SentimentAnalyzer() {
  // State for input text and analysis results
  const [input, setInput] = useState("")
  const [output, setOutput] = useState<OutputLine[]>([])
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [sentimentScore, setSentimentScore] = useState(0)
  const [sentimentCounts, setSentimentCounts] = useState<Record<string, number>>({})
  const [keywordTallies, setKeywordTallies] = useState<
    Record<string, Record<string, { count: number; lines: number[] }>>
  >({})
  const [paragraphsWithKeywords, setParagraphsWithKeywords] = useState<string[]>([])
  const [sentimentCategories, setSentimentCategories] = useState(defaultSentimentCategories)
  const [activeTab, setActiveTab] = useState("results")

  /**
   * Analyzes the input text for sentiment keywords
   * Processes each line, identifies keywords, calculates sentiment scores,
   * and tracks keyword occurrences and their locations
   */
  const analyzeText = () => {
    // Validate input
    if (!input.trim()) {
      alert("Please enter some text to analyze.")
      return
    }

    const lines = input.split(/\r?\n/)
    let totalWordCount = 0
    const newSentimentCounts: Record<string, number> = {}
    const newKeywordTallies: Record<string, Record<string, { count: number; lines: number[] }>> = {}
    const newOutput: OutputLine[] = []

    // Initialize counts and tallies
    Object.keys(sentimentCategories).forEach((category) => {
      newSentimentCounts[category] = 0
      newKeywordTallies[category] = {}
    })

    // Process paragraphs for context
    const paragraphs = input.split(/\r?\n\s*\r?\n/).filter((p) => p.trim().length > 0)
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

    // Update state
    setOutput(newOutput)
    setWordCount(totalWordCount)
    setCharCount(input.length)
    setSentimentScore(score)
    setSentimentCounts(newSentimentCounts)
    setKeywordTallies(newKeywordTallies)
    setParagraphsWithKeywords(paragraphs.filter((_, index) => paragraphKeywordFound[index]))

    // Switch to results tab
    setActiveTab("results")
  }

  /**
   * Resets all fields including input, categories, and results
   */
  const resetFields = () => {
    setInput("")
    setSentimentCategories(defaultSentimentCategories)
    clearResults()
  }

  /**
   * Clears only the input text and results
   */
  const clearInput = () => {
    setInput("")
    clearResults()
  }

  /**
   * Clears all analysis results
   */
  const clearResults = () => {
    setOutput([])
    setWordCount(0)
    setCharCount(0)
    setSentimentScore(0)
    setSentimentCounts({})
    setKeywordTallies({})
    setParagraphsWithKeywords([])
  }

  /**
   * Saves the current sentiment categories configuration to localStorage
   */
  const saveConfig = () => {
    try {
      localStorage.setItem("sentimentAnalyzerConfig", JSON.stringify(sentimentCategories))
      alert("Configuration saved successfully!")
    } catch (error) {
      console.error("Error saving configuration:", error)
      alert("Failed to save configuration. Please try again.")
    }
  }

  /**
   * Loads saved sentiment categories configuration from localStorage
   */
  const loadConfig = () => {
    try {
      const savedConfig = localStorage.getItem("sentimentAnalyzerConfig")
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig)
        setSentimentCategories(parsedConfig)
        alert("Configuration loaded successfully!")
      } else {
        alert("No saved configuration found.")
      }
    } catch (error) {
      console.error("Error loading configuration:", error)
      alert("Failed to load configuration. The saved data may be corrupted.")
    }
  }

  const handleCategoryChange = (category: string, value: string) => {
    setSentimentCategories((prev) => ({
      ...prev,
      [category]: value,
    }))
  }

  /**
   * Returns the sentiment score weight for a given category
   * Positive emotions have positive scores, negative emotions have negative scores
   * @param category - The sentiment category name
   * @returns The numeric weight for the sentiment (-1 to 1)
   */
  const getSentimentScore = (category: string): number => {
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

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Topper />
      <UsageInstructions />
      <Card className="shadow-lg mt-6">
        <CardContent className="pt-6">
          <div className="mb-6">
            <label htmlFor="input" className="block text-lg font-semibold mb-2">
              Enter Conversation Text:
            </label>
            <Textarea
              id="input"
              rows={6}
              className="w-full resize-none"
              placeholder="Paste your conversation here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>

            <TabsContent value="keywords" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(sentimentCategories).map(([category, keywords]) => (
                  <div key={category}>
                    <label htmlFor={`${category}Keywords`} className="block text-sm font-semibold mb-1">
                      {category} Keywords:
                    </label>
                    <Input
                      id={`${category}Keywords`}
                      value={keywords}
                      onChange={(e) => handleCategoryChange(category, e.target.value)}
                      className="w-full text-sm"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="results">
              {output.length > 0 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Statistics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li>
                            <span className="font-medium">Word Count:</span> {wordCount}
                          </li>
                          <li>
                            <span className="font-medium">Character Count:</span> {charCount}
                          </li>
                          <li>
                            <span className="font-medium">Sentiment Score:</span> {sentimentScore.toFixed(2)}
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Sentiment Visualization</CardTitle>
                      </CardHeader>
                      <CardContent className="h-[250px]">
                        <SentimentChart sentimentCounts={sentimentCounts} />
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">Analyzed Text</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[200px]">
                        <HighlightedText lines={output} />
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">Keyword Tally</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[200px]">
                        <KeywordTally tallies={keywordTallies} />
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">Paragraphs with Detected Keywords</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[200px]">
                        <ParagraphContext paragraphs={paragraphsWithKeywords} />
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex flex-wrap gap-3 justify-center">
            <Button onClick={analyzeText} className="bg-blue-500 hover:bg-blue-600">
              <Send className="mr-2 h-4 w-4" />
              Analyze
            </Button>
            <Button onClick={resetFields} variant="destructive">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset All
            </Button>
            <Button
              onClick={clearInput}
              variant="outline"
              className="border-yellow-500 text-yellow-500 hover:bg-yellow-50"
            >
              <X className="mr-2 h-4 w-4" />
              Clear Input
            </Button>
            <Button
              onClick={saveConfig}
              variant="outline"
              className="border-green-500 text-green-500 hover:bg-green-50"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Config
            </Button>
            <Button
              onClick={loadConfig}
              variant="outline"
              className="border-purple-500 text-purple-500 hover:bg-purple-50"
            >
              <Upload className="mr-2 h-4 w-4" />
              Load Config
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
