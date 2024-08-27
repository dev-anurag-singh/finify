import Link from 'next/link';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface NavButtonProps {
  href: string;
  label: string;
  isActive?: boolean;
}

function NavButton({ label, href, isActive, ...props }: NavButtonProps) {
  return (
    <Button
      asChild
      variant='ghost'
      className={cn(
        'w-full justify-start lg:justify-center lg:text-white lg:h-9 lg:hover:bg-white/20 lg:hover:text-white lg:font-normal lg:focus:bg-white/30',
        {
          'bg-secondary text-secondary-foreground  lg:bg-white/10': isActive,
        }
      )}
      {...props}
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
}

export default NavButton;
