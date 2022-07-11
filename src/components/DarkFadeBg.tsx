import classes from '../styles/DarkFadeBg.module.css'

const DarkFadeBg = ({ children }) => {
  return (
    <div>
      <div className={classes['fade-top']} />
      <div className={classes.bg}>{children}</div>
      <div className={classes['fade-bottom']} />
    </div>
  )
}

export default DarkFadeBg
