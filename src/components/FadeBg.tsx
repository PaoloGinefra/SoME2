import classes from '../styles/FadeBg.module.css'

const FadeBg = (props) => {
  return (
    <>
      {/* <div
        className={classes['fade-top']}
        style={{
          background:
            'linear-gradient(to top,' + props.color + ', rgba(0, 0, 0, 0))',
        }}
      /> */}
      <div className={classes.bg} style={{ backgroundColor: props.color }}>
        {props.children}
      </div>
      {/* <div
        className={classes['fade-bottom']}
        style={{
          background:
            'linear-gradient(to bottom,' + props.color + ', rgba(0, 0, 0, 0))',
        }}
      /> */}
    </>
  )
}

export default FadeBg
