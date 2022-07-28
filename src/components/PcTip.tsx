import classes from '../styles/PcTip.module.css'

export default function PcTip({ children }) {
  return <span className={classes.pctip}>{children}</span>
}
