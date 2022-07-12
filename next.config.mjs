import mdx from '@next/mdx'
import gfm from 'remark-gfm'

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [gfm],
    rehypePlugins: [],
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = withMDX({
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
})

export default nextConfig
