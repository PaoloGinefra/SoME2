import classes from '../styles/Quote.module.css'

export default function Question({ children }) {
  return <div className={classes.question}>{children}</div>
}
