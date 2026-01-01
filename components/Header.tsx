"use client";

import Image from 'next/image'
import { useNavbar } from './NavbarContextProvider'
const Header = () => {

  const {active, setActive} = useNavbar();
  return (
    <header className="flex justify-between items-center gap-2 w-full h-16">

      <div className='min-[1400px]:bg-bg-dark min-[1400px]:w-56 h-16 flex items-center  px-6'>
            <button  onClick={() => setActive((prev: boolean) => !prev)} className="shrink-0 min-[1400px]:hidden">
                  <Image src="/icons/list_dark.png" alt="close-icon" width={26} height={26} />
            </button>
      </div>
     
        <div className='w-60 md:w-xl mx-2 h-12 bg-bg-dark rounded-4xl flex justify-between items-center '>
            <input type="text" placeholder="Search" className="w-full h-full  flex items-center ml-4 outline-none placeholder:text-(--color-foreground)"  />
            <Image src='/icons/search_dark.png' alt='search-icon' width={20} height={20} className='mr-4'/>
        </div>

        <div className='hidden lg:flex lg:w-56'></div>
    </header>
  )
}

export default Header
