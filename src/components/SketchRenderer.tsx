import { useEffect, useRef } from 'react'
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

export interface SketchRendererProps {
  sketch: SketchFunction
}

const SketchRenderer = ({ sketch }: SketchRendererProps) => {
  const ref = useRef<HTMLDivElement>()

  useEffect(() => {
    const p5sketch = new p5(sketch, ref.current)
    return () => p5sketch.remove()
  }, [sketch])

  return <div ref={ref}></div>
}

export default SketchRenderer
