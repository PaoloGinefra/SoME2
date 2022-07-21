import { ReactNode, useState } from 'react'
import classes from '../styles/Spoiler.module.css'

interface SpoilerProps {
  children: ReactNode
}

const Spoiler = ({ children }: SpoilerProps) => {
  const [hidden, setHidden] = useState(true)

  const className = [
    classes.spoiler,
    hidden ? classes.hidden : classes.shown,
  ].join(' ')

  return (
    <span className={className} onClick={() => setHidden(false)}>
      {children}
    </span>
  )
}

export default Spoiler
