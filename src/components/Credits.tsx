import Chip from './Chip'
import classes from '../styles/Credits.module.css'

export interface CreditsProps {
  credits: Record<string, string[]>
}

export default function Credits({ credits }: CreditsProps) {
  const items = Object.entries(credits).map(([name, roles]) => (
    <li className={classes.item}>
      <span className={classes.name}>{name}</span>
      <span className={classes.roles}>
        {roles.map((role) => (
          <Chip text={role} />
        ))}
      </span>
    </li>
  ))

  return <ul className={classes.credit}>{items}</ul>
}
