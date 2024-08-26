import { ClerkLoaded, ClerkLoading } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='h-full grid grid-cols-1 grid-rows-1 lg:grid-cols-2'>
      <div className='grid place-content-center'>
        <div className='flex flex-col gap-8 items-center'>
          <div className='text-center space-y-4'>
            <h1 className='text-3xl font-bold text-[#2E2A47]'>Welcome back</h1>
            <p className='text-base text-[#7E8CA0]'>
              Log in or Create account to get back to your dashboard!
            </p>
          </div>
          <ClerkLoaded>{children}</ClerkLoaded>
          <ClerkLoading>
            <Loader2 className='animate-spin text-muted-foreground' />
          </ClerkLoading>
        </div>
      </div>
      <div className='bg-blue-600 flex items-center justify-center'>
        <Image src='/logo.svg' height={100} width={100} alt='brand logo' />
      </div>
    </div>
  );
}

export default AuthLayout;
