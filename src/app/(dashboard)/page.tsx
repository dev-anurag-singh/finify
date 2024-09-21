'use client';
import { Button } from '@/components/ui/button';
import { useNewAccount } from '@/features/accounts/hooks/use-new-account';

function Page() {
  const { onOpen } = useNewAccount();

  return (
    <div>
      <Button className=' ' onClick={onOpen}>
        Create account
      </Button>
    </div>
  );
}

export default Page;
