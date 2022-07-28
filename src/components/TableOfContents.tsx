import classes from '../styles/TableOfContents.module.css'

type TocEntry = string | { [key: string]: TocEntry }

interface TableOfContentsProps {
  toc: TocEntry
}

export default function TableOfContents({ toc }: TableOfContentsProps) {
  const parse = (tocEntry: TocEntry) => {
    const listKey = Object.values(tocEntry).join(' ')

    const listEntries = Object.entries(tocEntry).map(([title, href]) =>
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
