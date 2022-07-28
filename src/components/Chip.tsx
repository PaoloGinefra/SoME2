import classes from '../styles/Chip.module.css'

interface ChipProps {
  text: string
}

export default function Chip({ text }: ChipProps) {
  return <span className={classes.chip}>{text}</span>
}
