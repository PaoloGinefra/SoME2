import classes from '../styles/Caption.module.css'

export default function Caption({ children }) {
  return <div className={classes.caption}>{children}</div>
}
