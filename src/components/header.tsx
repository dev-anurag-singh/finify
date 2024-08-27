import { ClerkLoaded, ClerkLoading, UserButton } from '@clerk/nextjs';
import HeaderLogo from '@/components/header-logo';
import Navigation from '@/components/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import Welcome from '@/components/welcome';

function Header() {
  return (
    <header className='bg-gradient-to-b from-blue-700 to-blue-500 px-4 py-8 lg:px-14 pb-36'>
      <div className='max-w-screen-2xl mx-auto'>
        <div className='w-full flex items-center justify-between mb-14'>
          <div className='flex items-center lg:gap-x-16'>
            <HeaderLogo />
            <Navigation />
          </div>
          <ClerkLoaded>
            <UserButton />
          </ClerkLoaded>
          <ClerkLoading>
            <Skeleton className='h-7 w-7 rounded-full' />
          </ClerkLoading>
        </div>
        <Welcome />
      </div>
    </header>
  );
}

export default Header;
