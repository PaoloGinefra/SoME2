/**
 * Picks a random element from the array
 *
 * @param arr array of choiches to pick
 * @returns a random element from the array
 */
export function pick<T>(arr: readonly T[]): T {
  const i = Math.floor(Math.random() * arr.length)
  return arr[i]
}

export type Point = [x: number, y: number]

export function rectangleCenter(
  x: number,
  y: number,
  w: number,
  h: number
): Point {
  const x1 = x
  const y1 = y
  const x2 = x + w
  const y2 = y + h

  return [(x1 + x2) / 2, (y1 + y2) / 2]
}
