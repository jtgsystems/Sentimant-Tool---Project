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
import { analyzeSentiment, type Highlight } from "@/lib/analyze-sentiment"
import BulkDropzone from "@/components/bulk-dropzone"
import Topper from "@/components/topper"
import UsageInstructions from "@/components/usage-instructions"

export default function SentimentAnalyzer() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState<{ text: string; lineNumber: number; highlights: Highlight[] }[]>([])
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

  const analyzeText = () => {
    if (!input.trim()) return

    const result = analyzeSentiment(input, sentimentCategories)

    setOutput(result.lines)
    setWordCount(result.wordCount)
    setCharCount(result.charCount)
    setSentimentScore(result.sentimentScore)

    setSentimentCounts(result.sentimentCounts)
    setKeywordTallies(result.keywordTallies)
    setParagraphsWithKeywords(result.paragraphsWithKeywords)

    setActiveTab("results")
  }

  const resetFields = () => {
    setInput("")
    setSentimentCategories(defaultSentimentCategories)
    clearResults()
  }

  const clearInput = () => {
    setInput("")
    clearResults()
  }

  const clearResults = () => {
    setOutput([])
    setWordCount(0)
    setCharCount(0)
    setSentimentScore(0)
    setSentimentCounts({})
    setKeywordTallies({})
    setParagraphsWithKeywords([])
  }

  const saveConfig = () => {
    localStorage.setItem("sentimentAnalyzerConfig", JSON.stringify(sentimentCategories))
    alert("Configuration saved successfully!")
  }

  const loadConfig = () => {
    const savedConfig = localStorage.getItem("sentimentAnalyzerConfig")
    if (savedConfig) {
      setSentimentCategories(JSON.parse(savedConfig))
      alert("Configuration loaded successfully!")
    } else {
      alert("No saved configuration found.")
    }
  }

  const handleCategoryChange = (category: string, value: string) => {
    setSentimentCategories((prev) => ({
      ...prev,
      [category]: value,
    }))
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

          <BulkDropzone categories={sentimentCategories} />

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
