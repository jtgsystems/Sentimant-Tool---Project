import { defaultSentimentCategories } from '@/lib/sentiment-data'

describe('defaultSentimentCategories', () => {
  it('should contain all expected categories', () => {
    const expectedCategories = [
      'Positive',
      'Negative',
      'Confused',
      'Excited',
      'Neutral',
      'Angry',
      'Sad',
      'Fearful',
      'Surprised',
      'Disgusted',
      'Trustful',
      'Anticipative',
      'Bored',
      'Proud',
      'Hopeful',
      'Lonely',
      'Relieved',
      'Frustrated',
      'Enthralled',
      'Embarrassed',
      'Indignant',
      'Content',
    ]

    expectedCategories.forEach((category) => {
      expect(defaultSentimentCategories).toHaveProperty(category)
    })
  })

  it('should have keywords as comma-separated strings', () => {
    Object.values(defaultSentimentCategories).forEach((keywords) => {
      expect(typeof keywords).toBe('string')
      expect(keywords.length).toBeGreaterThan(0)
      expect(keywords).toContain(',')
    })
  })

  it('should have valid keywords in Positive category', () => {
    const positiveKeywords = defaultSentimentCategories.Positive
    expect(positiveKeywords).toContain('good')
    expect(positiveKeywords).toContain('great')
    expect(positiveKeywords).toContain('excellent')
  })

  it('should have valid keywords in Negative category', () => {
    const negativeKeywords = defaultSentimentCategories.Negative
    expect(negativeKeywords).toContain('disappointed')
    expect(negativeKeywords).toContain('bad')
    expect(negativeKeywords).toContain('poor')
  })
})
