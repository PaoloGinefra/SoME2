import { useEffect, useRef, useState } from 'react'
import { useOnScreen } from '../hooks/useOnScreen'
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
  const onScreen = useOnScreen(ref)
  const [height, setHeigth] = useState(initialHeigth)

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
    <div
      ref={ref}
      style={{ height }}
      className={padded ? classes.padded : undefined}
    >
      {onScreen && (
        <iframe
          src={src}
          style={{ height }}
          className={classes.frame}
          frameBorder={0}
        ></iframe>
      )}
    </div>
  )
}

export default SketchIframe
