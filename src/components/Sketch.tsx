import dynamic from 'next/dynamic'
import type * as p5 from 'p5'

declare global {
  interface Window {
    p5: typeof p5
  }
}

const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
})

export default Sketch
