import dynamic from 'next/dynamic'
import type { SketchRendererProps } from './SketchRenderer'

const SketchRenderer = dynamic<SketchRendererProps>(
  () => import('./SketchRenderer').then((mod) => mod.default),
  { ssr: false }
)

export default SketchRenderer
export type { SketchRendererProps } from './SketchRenderer'
