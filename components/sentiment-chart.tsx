"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

// Register Chart.js components
Chart.register(...registerables)

interface SentimentChartProps {
  sentimentCounts: Record<string, number>
}

/**
 * SentimentChart Component
 * Displays a pie chart visualization of sentiment distribution
 * Uses Chart.js to render the data with custom colors for each category
 *
 * @param sentimentCounts - Object mapping sentiment categories to their counts
 */
export default function SentimentChart({ sentimentCounts }: SentimentChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Filter categories with counts > 0
    const labels = Object.keys(sentimentCounts).filter((key) => sentimentCounts[key] > 0)
    const data = labels.map((label) => sentimentCounts[label])

    if (labels.length === 0) {
      // Clear canvas if no data
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      return
    }

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: labels.map((label) => getColorForChart(label)),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              boxWidth: 12,
              font: {
                size: 11,
              },
            },
          },
          title: {
            display: true,
            text: "Sentiment Distribution",
            font: {
              size: 14,
            },
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [sentimentCounts])

  return <canvas ref={chartRef} />
}

/**
 * Returns the color for a given sentiment category
 * @param category - The sentiment category name
 * @returns Hex color code for the category
 */
function getColorForChart(category: string): string {
  const colorMapping: Record<string, string> = {
    Positive: "#10B981",
    Negative: "#EF4444",
    Confused: "#F59E0B",
    Excited: "#F97316",
    Neutral: "#6B7280",
    Angry: "#8B5CF6",
    Sad: "#3B82F6",
    Fearful: "#6366F1",
    Surprised: "#EC4899",
    Disgusted: "#14B8A6",
    Trustful: "#047857",
    Anticipative: "#0369A1",
    Bored: "#374151",
    Proud: "#4338CA",
    Hopeful: "#0D9488",
    Lonely: "#1D4ED8",
    Relieved: "#059669",
    Frustrated: "#B91C1C",
    Enthralled: "#6D28D9",
    Embarrassed: "#DB2777",
    Indignant: "#991B1B",
    Content: "#D97706",
  }
  return colorMapping[category] || "#CCCCCC"
}
