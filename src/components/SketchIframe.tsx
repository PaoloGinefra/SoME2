import classes from '../styles/SketchIframe.module.css'

interface SketchIframeProps {
  src: string
  height: number
}

const SketchIframe = ({ src, height }: SketchIframeProps) => (
  <iframe
    src={src}
    style={{ height }}
    className={classes.frame}
    frameBorder={0}
  ></iframe>
)

export default SketchIframe
