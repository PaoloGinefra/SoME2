import { useEffect, useRef } from 'react'
import p5 from 'p5'

declare global {
  interface Window {
    p5: typeof p5
  }
}

if (!window.p5) {
  window.p5 = p5
}

export interface SketchProps {
  sketchFunction: (p: p5) => void
}

const Sketch = ({ sketchFunction }: SketchProps) => {
  const ref = useRef<HTMLDivElement>()

  useEffect(() => {
    const p5sketch = new p5(sketchFunction, ref.current)
    return () => p5sketch.remove()
  })

  return <div ref={ref}></div>
}

export default Sketch
