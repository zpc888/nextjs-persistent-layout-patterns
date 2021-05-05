import 'tailwindcss/tailwind.css'

import SiteLayout from '../components/SiteLayout'
import AccountSettingsLayout from '../components/AccountSettingsLayout'

function MyApp({ Component, pageProps, router }) {
  if (router.pathname.startsWith('/account-settings/')) {
    return (
      <SiteLayout>
        <AccountSettingsLayout>
          <Component {...pageProps} />
        </AccountSettingsLayout>
      </SiteLayout>
    )
  } else {
    return (
      <SiteLayout>
        <Component {...pageProps} />
      </SiteLayout>
    )
  }
}

export default MyApp
