import Link from 'next/link'
import Image from 'next/image'

export default function SiteLayout({ children }) {
    return (
      <div className="bg-white antialiased">
        <div>
          <div>
            <div className="max-w-3xl mx-auto px-8">
              <nav>
                <div className="py-4 flex-shrink-0 flex items-center">
                  {/* <img className="h-8 w-8" src="/logo.svg" alt="" /> */}
                  <Image width="24" height="24" src="/logo.svg" alt="" />
                  <Link href="/">
                    <a className="ml-8 font-medium text-gray-900">Home</a>
                  </Link>
                  <Link href="/account-settings/basic-information">
                    <a className="ml-8 font-medium text-gray-900">
                      Account Settings
                    </a>
                  </Link>
                  <Link href="/profiles/logo-uploading">
                    <a className="ml-8 font-medium text-gray-900">
                      Profile Logo
                    </a>
                  </Link>
                </div>
                <div className="mt-2">
                  <input
                    className="block w-full border border-gray-300 rounded-lg bg-gray-100 px-3 py-2 leading-tight focus:outline-none focus:border-gray-600 focus:bg-white"
                    placeholder="Search..."
                  />
                </div>
              </nav>
            </div>
          </div>
        </div>
        <div className="mt-6 sm:mt-0 sm:py-12">{children}</div>
      </div>
    )
}

export const getLayout = ( page ) => <SiteLayout>{page}</SiteLayout>