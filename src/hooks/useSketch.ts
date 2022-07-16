import { useCallback } from 'react'
import type p5 from 'p5'

export type SketchFunction = (p5: p5) => void

const useSketch = (sketch: SketchFunction): SketchFunction => {
  // we never want to re-evalutate the callback
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(sketch, [])
}

export default useSketch
