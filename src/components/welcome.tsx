'use client';

import { useUser } from '@clerk/nextjs';
import { Circle } from 'lucide-react';
import { useEffect, useState } from 'react';

function Welcome() {
  const { user } = useUser();
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (user) {
      if (user.firstName || (user.firstName = 'Guest')) {
        if (index < user.firstName.length) {
          const timeout = setTimeout(() => {
            setDisplayedText(prev => prev + user.firstName?.charAt(index));
            setIndex(index + 1);
          }, 150);

          return () => clearTimeout(timeout);
        }
      }
    }
  }, [user, index]);

  return (
    <div className='space-y-2 mb-4'>
      <h2 className='text-2xl lg:text-4xl text-white font-medium'>
        <span>Welcome Back,</span>
        <span id='typing-name' className='ml-1'>
          {displayedText}
        </span>
        {!user && (
          <span className='inline-block animate-blink'>
            <Circle className='fill-white ml-1' />
          </span>
        )}
      </h2>
      <p className='text-sm lg:text-base text-[#89b6fd]'>
        This is your Financial Overview Report
      </p>
    </div>
  );
}

export default Welcome;
