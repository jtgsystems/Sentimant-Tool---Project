"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UploadCloud, FileText, X, RefreshCw } from "lucide-react"
import SentimentChart from "@/components/sentiment-chart"
import KeywordTally from "@/components/keyword-tally"
import HighlightedText from "@/components/highlighted-text"
import ParagraphContext from "@/components/paragraph-context"
import { analyzeSentiment, type SentimentCategoryMap } from "@/lib/analyze-sentiment"

const SUPPORTED_EXTENSIONS = [".txt", ".md", ".csv", ".json", ".log"]
const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp"]

// Local OCR bridge (see ~/Desktop/UltraFast-RapidOCR/ocr_bridge.py)
const OCR_BRIDGE_URL = "http://127.0.0.1:8770/ocr"

async function ocrImage(file: File): Promise<string> {
  const res = await fetch(OCR_BRIDGE_URL, {
    method: "POST",
    headers: {
      "Content-Type": file.type || "image/*",
      "X-Filename": file.name,
    },
    body: await file.arrayBuffer(),
  })
  if (!res.ok) {
    throw new Error(`OCR bridge error (HTTP ${res.status})`)
  }
  const data = (await res.json()) as { ok?: boolean; text?: string; error?: string }
  if (!data.ok) throw new Error(data.error || "OCR failed")
  return data.text || ""
}

interface BulkResult {
  name: string
  size: number
  text: string
  wordCount: number
  charCount: number
  score: number
  counts: Record<string, number>
  tallies: Record<string, Record<string, { count: number; lines: number[] }>>
  lines: {
    text: string
    lineNumber: number
    highlights: { word: string; index: number; category: string }[]
  }[]
  paragraphs: string[]
  error: string | null
}

interface BulkDropzoneProps {
  categories: SentimentCategoryMap
}

export default function BulkDropzone({ categories }: BulkDropzoneProps) {
  const [files, setFiles] = useState<BulkResult[]>([])
  const [openName, setOpenName] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList) return
    const incoming: File[] = Array.from(fileList)
    const results = await Promise.all(
      incoming.map(async (file) => {
        const name = file.name.toLowerCase()
        const isImage = IMAGE_EXTENSIONS.some((ext) => name.endsWith(ext))
        const isText = SUPPORTED_EXTENSIONS.some((ext) => name.endsWith(ext))
        if (!isImage && !isText) {
          return {
            name: file.name,
            size: file.size,
            text: "",
            wordCount: 0,
            charCount: 0,
            score: 0,
            counts: {},
            tallies: {},
            lines: [],
            paragraphs: [],
            error: "Unsupported file type",
          }
        }
        let rawText = ""
        try {
          if (isImage) {
            rawText = await ocrImage(file)
          } else {
            rawText = await file.text()
            if (name.endsWith(".json")) {
              try {
                const parsed = JSON.parse(rawText)
                if (typeof parsed !== "string") {
                  rawText = JSON.stringify(parsed, null, 2)
                }
              } catch {
                // keep raw text if JSON is invalid
              }
            }
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : "Failed to read file"
          const suffix = isImage
            ? " — is the local OCR bridge running? (python3 ~/Desktop/UltraFast-RapidOCR/ocr_bridge.py)"
            : ""
          return {
            name: file.name,
            size: file.size,
            text: "",
            wordCount: 0,
            charCount: 0,
            score: 0,
            counts: {},
            tallies: {},
            lines: [],
            paragraphs: [],
            error: `${message}${suffix}`,
          }
        }
        if (isImage && !rawText.trim()) {
          return {
            name: file.name,
            size: file.size,
            text: "",
            wordCount: 0,
            charCount: 0,
            score: 0,
            counts: {},
            tallies: {},
            lines: [],
            paragraphs: [],
            error: "No text detected in image",
          }
        }
        const result = analyzeSentiment(rawText, categories)
        return {
          name: file.name,
          size: file.size,
          text: rawText,
          wordCount: result.wordCount,
          charCount: result.charCount,
          score: result.sentimentScore,
          counts: result.sentimentCounts,
          tallies: result.keywordTallies,
          lines: result.lines,
          paragraphs: result.paragraphsWithKeywords,
          error: null,
        }
      }),
    )
    setFiles((prev) => [...prev, ...results])
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => {
    setDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    void handleFiles(e.dataTransfer.files)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    void handleFiles(e.target.files)
    e.target.value = ""
  }

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((file) => file.name !== name))
    setOpenName((current) => (current === name ? null : current))
  }

  const clearAll = () => {
    setFiles([])
    setOpenName(null)
  }

  const totalWords = files.reduce((sum, file) => sum + file.wordCount, 0)
  const allCounts: Record<string, number> = {}
  files.forEach((file) => {
    Object.entries(file.counts).forEach(([category, count]) => {
      allCounts[category] = (allCounts[category] || 0) + count
    })
  })
  const dominantSentiment = getDominant(allCounts)

  const openFile = files.find((file) => file.name === openName) || null

  return (
    <div className="space-y-6">
      <div>
        <CardTitle className="text-xl mb-2">Bulk Upload &amp; Analyze</CardTitle>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
          }`}
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UploadCloud className="mx-auto h-10 w-10 text-gray-400 mb-2" />
          <p className="text-gray-600">Drag and drop files here or click to browse</p>
          <p className="text-xs text-gray-400 mt-1">
            Supported: .txt, .md, .csv, .json, .log, and images (.png, .jpg, .webp) via OCR
          </p>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".txt,.md,.csv,.json,.log,.png,.jpg,.jpeg,.webp,.gif,.bmp"
            className="hidden"
            onChange={handleInputChange}
          />
        </div>
      </div>

      {files.length > 0 && (
        <Card>
          <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl">Overview</CardTitle>
            {files.length > 1 && (
              <Button variant="outline" size="sm" onClick={clearAll}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Clear all
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-500">Documents</div>
                <div className="text-2xl font-semibold">{files.length}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Words</div>
                <div className="text-2xl font-semibold">{totalWords}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Dominant Sentiment</div>
                <div className="text-2xl font-semibold">
                  {dominantSentiment
                    ? `${dominantSentiment.name} (${dominantSentiment.count})`
                    : "none"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => {
            const dominant = getDominant(file.counts)
            const isOpen = openFile?.name === file.name
            return (
              <Card
                key={file.name}
                className={`cursor-pointer ${isOpen ? "ring-2 ring-blue-500" : ""}`}
                onClick={() => setOpenName(isOpen ? null : file.name)}
              >
                <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm flex items-center gap-2 truncate">
                    <FileText className="h-4 w-4 shrink-0 text-gray-400" />
                    <span className="truncate">{file.name}</span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(file.name)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="pt-2">
                  {file.error ? (
                    <p className="text-red-500 text-sm">{file.error}</p>
                  ) : (
                    <>
                      <div className="text-sm text-gray-500 mb-1">
                        {file.wordCount} words
                      </div>
                      <div className="text-sm">
                        {dominant
                          ? `${dominant.name} (${dominant.count})`
                          : "No sentiment detected"}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {openFile && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl truncate">{openFile.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {openFile.error && <p className="text-red-500">{openFile.error}</p>}
            {!openFile.error && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Words</div>
                    <div className="text-xl font-semibold">{openFile.wordCount}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Chars</div>
                    <div className="text-xl font-semibold">{openFile.charCount}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Score</div>
                    <div className="text-xl font-semibold">{openFile.score.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Mood</div>
                    <div className="text-xl font-semibold">
                      {getDominant(openFile.counts)?.name || "None"}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Sentiment Distribution</h3>
                  <div className="h-[220px]">
                    <SentimentChart sentimentCounts={openFile.counts} />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Highlighted Text</h3>
                  <ScrollArea className="h-[180px]">
                    <HighlightedText lines={openFile.lines} />
                  </ScrollArea>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Keyword Tally</h3>
                  <ScrollArea className="h-[180px]">
                    <KeywordTally tallies={openFile.tallies} />
                  </ScrollArea>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Paragraph Context</h3>
                  <ScrollArea className="h-[150px]">
                    <ParagraphContext paragraphs={openFile.paragraphs} />
                  </ScrollArea>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function getDominant(counts: Record<string, number>): { name: string; count: number } | null {
  let bestName: string | null = null
  let bestCount = 0
  for (const [category, count] of Object.entries(counts)) {
    if (count > bestCount) {
      bestName = category
      bestCount = count
    }
  }
  return bestName ? { name: bestName, count: bestCount } : null
}
