import classes from '../styles/TextContainer.module.css'

const TextContainer = ({ children }) => {
  return <div className={classes.container}>{children}</div>
}

export default TextContainer
