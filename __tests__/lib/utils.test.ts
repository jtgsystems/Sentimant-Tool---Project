import { cn } from '@/lib/utils'

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('class1', 'class2')
    expect(result).toContain('class1')
    expect(result).toContain('class2')
  })

  it('should handle conditional classes', () => {
    const result = cn('base', false && 'conditional', 'always')
    expect(result).toContain('base')
    expect(result).toContain('always')
    expect(result).not.toContain('conditional')
  })

  it('should merge Tailwind classes correctly', () => {
    const result = cn('px-2', 'px-4')
    // Should keep only the last px class
    expect(result).toBe('px-4')
  })

  it('should handle undefined and null values', () => {
    const result = cn('class1', undefined, null, 'class2')
    expect(result).toContain('class1')
    expect(result).toContain('class2')
  })
})
