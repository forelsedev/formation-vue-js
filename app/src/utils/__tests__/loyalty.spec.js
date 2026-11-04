import { describe, it, expect } from 'vitest'
import { getLevel, getNextLevel, pointsToNextLevel, levelProgress, formatPrice } from '../loyalty'

describe('getLevel', () => {
  it.each([
    [0, 'Bronze'],
    [499, 'Bronze'],
    [500, 'Argent'],
    [999, 'Argent'],
    [1000, 'Or'],
    [5000, 'Or'],
  ])('%i points → niveau %s', (points, expected) => {
    expect(getLevel(points).name).toBe(expected)
  })
})

describe('niveau suivant', () => {
  it('donne le niveau suivant et les points manquants', () => {
    expect(getNextLevel(833).name).toBe('Or')
    expect(pointsToNextLevel(833)).toBe(167)
  })

  it("n'a pas de niveau suivant au niveau Or", () => {
    expect(getNextLevel(1200)).toBeNull()
    expect(pointsToNextLevel(1200)).toBe(0)
  })
})

describe('levelProgress', () => {
  it('vaut 0 au début du niveau et 0,5 à mi-chemin', () => {
    expect(levelProgress(500)).toBe(0)
    expect(levelProgress(750)).toBe(0.5)
  })

  it('vaut 1 au niveau maximum', () => {
    expect(levelProgress(1500)).toBe(1)
  })
})

describe('formatPrice', () => {
  it('formate en euros à la française', () => {
    // toLocaleString utilise des espaces insécables : on les normalise pour comparer
    expect(formatPrice(1234.5).replace(/\s/g, ' ')).toBe('1 234,50 €')
  })
})
