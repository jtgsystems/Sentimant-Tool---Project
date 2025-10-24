import { render, screen } from '@testing-library/react'
import KeywordTally from '@/components/keyword-tally'

describe('KeywordTally Component', () => {
  it('should display message when no keywords detected', () => {
    render(<KeywordTally tallies={{}} />)
    expect(screen.getByText('No keywords detected')).toBeInTheDocument()
  })

  it('should display keywords when present', () => {
    const tallies = {
      Positive: {
        good: { count: 3, lines: [1, 2, 3] },
        great: { count: 2, lines: [4, 5] },
      },
      Negative: {
        bad: { count: 1, lines: [6] },
      },
    }
    render(<KeywordTally tallies={tallies} />)

    expect(screen.getByText(/Positive Keywords/)).toBeInTheDocument()
    expect(screen.getByText(/good: 3/)).toBeInTheDocument()
    expect(screen.getByText(/great: 2/)).toBeInTheDocument()
    expect(screen.getByText(/Negative Keywords/)).toBeInTheDocument()
    expect(screen.getByText(/bad: 1/)).toBeInTheDocument()
  })

  it('should sort keywords by count descending', () => {
    const tallies = {
      Positive: {
        good: { count: 1, lines: [1] },
        great: { count: 5, lines: [2] },
        excellent: { count: 3, lines: [3] },
      },
    }
    const { container } = render(<KeywordTally tallies={tallies} />)
    const keywords = container.querySelectorAll('li span')

    // First keyword should be "great" with highest count
    expect(keywords[0].textContent).toContain('great: 5')
  })

  it('should not display empty categories', () => {
    const tallies = {
      Positive: {
        good: { count: 1, lines: [1] },
      },
      Negative: {},
    }
    render(<KeywordTally tallies={tallies} />)

    expect(screen.getByText(/Positive Keywords/)).toBeInTheDocument()
    expect(screen.queryByText(/Negative Keywords/)).not.toBeInTheDocument()
  })
})
