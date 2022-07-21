import { CSSProperties, useEffect, useRef } from 'react'
import p5 from 'p5'
import { SketchFunction } from '../hooks/useSketch'

declare global {
  interface Window {
    p5: typeof p5
  }
}

if (!window.p5) {
  window.p5 = p5
}

export type Dimensions = [width: number, height: number]

export interface SketchRendererProps {
  sketch: SketchFunction
  className?: string
  style?: CSSProperties
}

const SketchRenderer = ({ sketch, ...props }: SketchRendererProps) => {
  const ref = useRef<HTMLDivElement>()

  useEffect(() => {
    const p5sketch = new p5(sketch, ref.current)
    return () => p5sketch.remove()
  }, [sketch])

  return <div ref={ref} {...props}></div>
}

export default SketchRenderer
