import classes from '../styles/TableOfContents.module.css'

type TocEntry = string | { [key: string]: TocEntry }

const toc: TocEntry = {
  'An adventurous mathematician': '#an-adventurous-mathematician',
  'An orientation problem fair and square':
    '#an-orientation-problem-fair-and-square',
  "What's behind the trick": '#whats-behind-the-trick',
  '.': {
    'Time to abstract': '#time-to-abstract',
    'When words are sharper than bits': '#when-words-are-sharper-than-bits',
    'Reasoning about the unknown': '#reasoning-about-the-unknown',
    "There's more than mines and lego bricks":
      '#theres-more-than-mines-and-lego-bricks',
  },
}

export default function TableOfContents() {
  const parse = (abs: TocEntry) => {
    const listKey = Object.values(abs).join(' ')

    const listEntries = Object.entries(abs).map(([title, href]) =>
      typeof href == 'string' ? (
        <li key={href} className={classes.li}>
          <a className={classes.a} href={href}>
            {title}
          </a>
        </li>
      ) : (
        parse(href)
      )
    )

    return (
      <ul key={listKey} className={classes.ul}>
        {listEntries}
      </ul>
    )
  }
  return (
    <div className={classes.toc}>
      <p className={classes.p}>Table of Contents:</p>
      {parse(toc)}
    </div>
  )
}
