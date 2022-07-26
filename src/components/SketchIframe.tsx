import { useEffect, useReducer, useRef, useState } from 'react'
import classes from '../styles/SketchIframe.module.css'

interface SketchIframeProps {
  src: string
  initialHeigth: number

  // aspect ration expressed as width/height
  // if not defined the iframe will use `width` as width
  aspectRatio?: number

  padded?: boolean
}

const SketchIframe = ({
  src,
  initialHeigth,
  aspectRatio,
  padded = false,
}: SketchIframeProps) => {
  const ref = useRef<HTMLIFrameElement>()
  const [height, setHeigth] = useState(initialHeigth)

  const className = [classes.frame, padded && classes.padded]
    .filter((x) => !!x)
    .join(' ')

  useEffect(() => {
    if (!aspectRatio) return

    const doResize = () => {
      const w = ref.current.clientWidth
      const h = w / aspectRatio
      setHeigth(h)
    }
    doResize()

    window.addEventListener('resize', doResize)
    return () => window.removeEventListener('resize', doResize)
  })

  return (
    <iframe
      ref={ref}
      src={src}
      style={{ height }}
      className={className}
      frameBorder={0}
    ></iframe>
  )
}

export default SketchIframe
