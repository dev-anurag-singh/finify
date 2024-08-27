'use client';
import { usePathname } from 'next/navigation';
import NavButton from './nav-button';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { Menu } from 'lucide-react';

const links = [
  {
    label: 'Overview',
    href: '/',
  },
  {
    label: 'Transations',
    href: '/transactions',
  },
  {
    label: 'Accounts',
    href: '/accounts',
  },
  {
    label: 'Categories',
    href: '/categories',
  },
  {
    label: 'Settings',
    href: '/settings',
  },
];

function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Navigation */}
      <Sheet>
        <SheetTrigger className='lg:hidden' asChild>
          <Button
            size='sm'
            variant='outline'
            className='bg-white/10 text-white border-none hover:bg-white/20 hover:text-white'
          >
            <Menu className='size-4' />
          </Button>
        </SheetTrigger>
        <SheetContent className='px-2 lg:hidden' side='left'>
          <nav className='flex flex-col items-center gap-2 pt-6'>
            {links.map(link => (
              <SheetClose asChild key={link.label}>
                <NavButton
                  label={link.label}
                  href={link.href}
                  isActive={pathname === link.href}
                />
              </SheetClose>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Destop Navigation */}
      <nav className='hidden lg:flex items-center gap-x-2'>
        {links.map(link => (
          <NavButton
            key={link.label}
            label={link.label}
            href={link.href}
            isActive={pathname === link.href}
          />
        ))}
      </nav>
    </>
  );
}

export default Navigation;
