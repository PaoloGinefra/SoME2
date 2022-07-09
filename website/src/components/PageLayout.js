import classes from '../styles/PageLayout.module.css'

const PageLayout = ({ children }) => {
  return <div className={classes.container}>{children}</div>
}

export default PageLayout
