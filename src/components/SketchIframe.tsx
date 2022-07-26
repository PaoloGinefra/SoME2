import classes from '../styles/SketchIframe.module.css'

interface SketchIframeProps {
  src: string
  height: number
  padded?: boolean
}

const SketchIframe = ({ src, height, padded = false }: SketchIframeProps) => {
  const className = [classes.frame, padded && classes.padded]
    .filter((x) => !!x)
    .join(' ')

  return (
    <iframe
      src={src}
      style={{ height }}
      className={className}
      frameBorder={0}
    ></iframe>
  )
}

export default SketchIframe
