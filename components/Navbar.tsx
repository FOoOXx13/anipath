"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useNavbar } from './NavbarContextProvider';

const link_items = [
  { id: 1, href: '/', icon: '/icons/home_dark.png', label: 'Home' },
  { id: 2, href: '/anime', icon: '/icons/home_dark.png', label: 'Anime' },
];

const Navbar = () => {
  const { active, setActive } = useNavbar();

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <div className="hidden md:flex w-56 h-full bg-bg-dark flex-col gap-2 px-2">
        <div>
          <div className="w-56 h-16 px-4 flex items-center"></div>
        </div>
        {link_items.map(item => (
          <Link
            key={item.id}
            href={item.href}
            className="flex gap-4 text-base py-2 px-4 mt-2 hover:bg-(--bg-light) rounded-2xl"
          >
            <Image src={item.icon} alt="" width={24} height={24} />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      {/* MOBILE OVERLAY (smooth fade) */}
      <div
        onClick={() => setActive(false)}
        className={`
          fixed inset-0 z-40
          bg-black/50 backdrop-blur-sm
          transition-opacity duration-300
          md:hidden
          ${active ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
      />

      {/* MOBILE NAVBAR */}
      <div
        className={`
          fixed top-0 left-0 z-50
          w-56 h-full bg-bg-dark px-2 flex flex-col gap-2
          transition-transform duration-300 ease-in-out
          md:hidden
          ${active ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <button
          onClick={() => setActive(false)}
          className="w-56 h-16 px-4 shrink-0"
        >
          <Image src="/icons/list_dark.png" alt="" width={26} height={26} />
        </button>

        {link_items.map(item => (
          <Link
            key={item.id}
            href={item.href}
            onClick={() => setActive(false)}
            className="flex gap-4 text-base py-2 px-4 mt-2 hover:bg-(--bg-light) rounded-2xl"
          >
            <Image src={item.icon} alt="" width={24} height={24} />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Navbar;
