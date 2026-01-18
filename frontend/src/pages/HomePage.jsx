import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react'

function HomePage() {
  return (
    <div>
      <SignedOut>
        <SignInButton mode="modal">
        <button>Login</button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <SignOutButton/>
      </SignedIn>
      <UserButton/>
    </div>
  )
}

export default HomePage
