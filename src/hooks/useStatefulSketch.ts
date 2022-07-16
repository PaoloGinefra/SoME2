import { MutableRefObject, useRef } from 'react'
import type p5 from 'p5'
import useSketch, { SketchFunction } from './useSketch'

export type StatefulSketchFunction<S> = (
  stateRef: MutableRefObject<S>,
  p5: p5
) => void

const useStatefulSketch = <S>(
  state: S,
  sketch: StatefulSketchFunction<S>
): SketchFunction => {
  const ref = useRef<S>()
  ref.current = state

  return useSketch((p5) => sketch(ref, p5))
}

export default useStatefulSketch
