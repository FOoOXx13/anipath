"use client";
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react';

const link_items = [
  {
    id: 1,
    href: '/',
    icon: '/icons/home_dark.png',
    label: 'Home'
  },
  {
    id: 2,
    href: '/anime',
    icon: '/icons/home_dark.png',

    label: 'Anime'
  },
  // Add more link items as needed
];

const Navbar = () => {
  const [active, setActive] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Track screen size to handle desktop/mobile logic
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1400);
    handleResize(); // check on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu automatically on desktop
  useEffect(() => {
    if (isDesktop) setActive(false);
  }, [isDesktop]);

  return (
    <>
      {/* Mobile toggle button */}
      {!isDesktop && (
        <div className="w-10 flex justify-center items-center h-16">
          <button onClick={() => setActive(prev => !prev)} className="shrink-0">
            <Image src="/icons/list_dark.png" alt="list-icon" width={24} height={24} />
          </button>
        </div>
      )}

      {/* Navbar */}
      <div className={`
        ${!isDesktop && !active ? 'hidden' : ''}
        w-56 h-full bg-bg-dark flex-col gap-2 px-2 py-5 
        ${!isDesktop ? 'fixed top-0 left-0 z-50' : 'flex'}
      `}>
        {/* Mobile close button */}
        {!isDesktop && (
          <button onClick={() => setActive(false)} className="shrink-0 mb-4 mx-4 lg:mx-0">
            <Image src="/icons/list_dark.png" alt="close-icon" width={24} height={24} />
          </button>
        )}

        {link_items.map(item => (
          <Link
            key={item.id}
            href={item.href}
            className="flex gap-4 text-base py-2 px-4 mt-2 hover:bg-(--bg-light) rounded-2xl"
          >
            <Image src={item.icon} alt={`${item.label}-icon`} width={24} height={24} />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Navbar;