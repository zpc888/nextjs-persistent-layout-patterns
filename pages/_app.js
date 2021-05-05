import 'tailwindcss/tailwind.css'

import SiteLayout from '../components/SiteLayout'

function MyApp({ Component, pageProps }) {
  const Layout = Component.layout || SiteLayout
    return (
      <Layout>
          <Component {...pageProps} />
      </Layout>
    )
}

export default MyApp
