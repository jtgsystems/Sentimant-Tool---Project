import { render } from '@testing-library/react'
import SentimentChart from '@/components/sentiment-chart'

describe('SentimentChart Component', () => {
  it('should render without crashing with empty data', () => {
    const { container } = render(<SentimentChart sentimentCounts={{}} />)
    expect(container.querySelector('canvas')).toBeInTheDocument()
  })

  it('should render with sentiment data', () => {
    const sentimentCounts = {
      Positive: 5,
      Negative: 3,
      Neutral: 2,
    }
    const { container } = render(<SentimentChart sentimentCounts={sentimentCounts} />)
    expect(container.querySelector('canvas')).toBeInTheDocument()
  })

  it('should handle zero counts', () => {
    const sentimentCounts = {
      Positive: 0,
      Negative: 0,
      Neutral: 0,
    }
    const { container } = render(<SentimentChart sentimentCounts={sentimentCounts} />)
    expect(container.querySelector('canvas')).toBeInTheDocument()
  })
})
