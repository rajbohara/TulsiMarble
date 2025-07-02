import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

export default function Clerkheader() {
  return (
    <header className='m-0 p-0 h-6'>
      <SignedOut >
        
<SignInButton mode="modal">
  <button className=" text-white font-bold rounded">
    Sign In
  </button>
</SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton appearance={{ elements: { userButtonAvatarBox: 'h-6 w-6' } }} />
      </SignedIn>
    </header>
  );
}