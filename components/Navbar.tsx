"use client";
import Image from 'next/image'
import Link from 'next/link'
import {  useEffect, useState } from 'react';


const link_items = [
    {
        id:1,
        href:'/',
        icon:'/icons/home_dark.png',
        label:'Home'
    },
    // Add more link items as needed
];


const Navbar = () => {
  const [active,setActive] = useState(false)
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const handleResize = () => setWindowWidth(window.innerWidth);

    // Listen for resize
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);

  },[])

  return (
    <>
    <div className='w-10 flex justify-center items-center h-16 md:hidden'>
     <button onClick={() => setActive(prev => !prev)} className='shrink-0 md:hidden'>
            <Image src='/icons/list_dark.png' alt='list-icon'  width={24} height={24}  />
      </button>
    </div>

    <div className={
      active ? 'fixed top-0 left-0 z-9999 w-60 h-full bg-bg-dark flex flex-col gap-2 px-2 py-5 rounded-tr-2xl rounded-br-2xl ' : windowWidth < 768 ? 'hidden' : "w-60 h-full bg-bg-dark flex flex-col gap-2 px-2 py-5 rounded-tr-2xl rounded-br-2xl"} >
      <button onClick={() => setActive(prev => !prev)} className='shrink-0 md:hidden'>
            <Image src='/icons/list_dark.png' alt='list-icon'  width={24} height={24}  />
      </button>

        {link_items.map((item) => (
        <Link key={item.id} href={item.href} className="flex gap-4 text-base py-1 px-4 mt-4 hover:bg-(--bg-light) rounded-2xl ">
           <Image src={item.icon} alt='home-icon' width={24} height={24}/>
           <span>{item.label}</span>
        </Link>
        ))}

    </div>
    </>
  )
}

export default Navbar
