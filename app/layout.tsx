import { ClerkProvider, SignInButton, SignOutButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import "@/styles/globals.css";
import {Providers} from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className='dark'>
        <body>
          <Providers>
            <header>
              <SignOutButton />
            </header>
            <main>
              {children}
            </main>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
