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
        <meta
          property="og:image"
          content="https://github.com/PaoloGinefra/SoME2/blob/main/public/img/copertina.png?raw=true"
        />
        <meta property="og:image:width" content="1000" />
        <meta property="og:image:height" content="1000" />
        <meta name="og:title" content={siteTitle} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <title>{siteTitle}</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
