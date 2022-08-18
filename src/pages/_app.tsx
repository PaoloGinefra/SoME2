import { usePanelbear } from '@panelbear/panelbear-nextjs'
import { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'

const siteTitle = 'All roads lead to Rome, a colorful problem'

function MyApp({ Component, pageProps }: AppProps) {
  usePanelbear('syXnCOBTsy')

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content={
            'A SoME2 submission about the so-called "Road coloring problem"'
          }
        />
        <meta property="og:image" content={`./public/img/copertina.png`} />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <title>{siteTitle}</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
