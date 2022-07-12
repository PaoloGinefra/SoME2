import dynamic from 'next/dynamic'
import type { SketchProps } from './Sketch'

const Sketch = dynamic<SketchProps>(
  () => import('./Sketch').then((mod) => mod.default),
  { ssr: false }
)

export default Sketch
export type { SketchProps } from './Sketch'
