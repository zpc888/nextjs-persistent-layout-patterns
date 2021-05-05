import 'tailwindcss/tailwind.css'

import SiteLayout from '../components/SiteLayout'

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || (page => <SiteLayout children={page} />)
  return getLayout( <Component {...pageProps} /> ) 
}

export default MyApp
