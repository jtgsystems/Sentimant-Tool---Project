import { render, screen } from '@testing-library/react'
import ParagraphContext from '@/components/paragraph-context'

describe('ParagraphContext Component', () => {
  it('should display message when no paragraphs with keywords', () => {
    render(<ParagraphContext paragraphs={[]} />)
    expect(screen.getByText('No paragraphs with keywords detected')).toBeInTheDocument()
  })

  it('should display paragraphs when present', () => {
    const paragraphs = [
      'This is a great conversation.',
      'I am very happy with the service.',
    ]
    render(<ParagraphContext paragraphs={paragraphs} />)

    expect(screen.getByText('This is a great conversation.')).toBeInTheDocument()
    expect(screen.getByText('I am very happy with the service.')).toBeInTheDocument()
  })

  it('should render multiple paragraphs', () => {
    const paragraphs = ['Para 1', 'Para 2', 'Para 3']
    const { container } = render(<ParagraphContext paragraphs={paragraphs} />)

    const paragraphElements = container.querySelectorAll('p.border-l-4')
    expect(paragraphElements).toHaveLength(3)
  })
})
