import classes from '../styles/Quote.module.css'

export default function Quote({ children }) {
  return <div className={classes.question}>{children}</div>
}
