import Image from 'next/image'

const Header = () => {

  
  return (
    <header className="flex justify-center items-center gap-8 ">
     

        <div className='w-60 md:w-xl h-12 bg-bg-dark rounded-4xl flex justify-between items-center'>
            <input type="text" placeholder="Search" className="w-full h-full  flex items-center ml-4 outline-none placeholder:text-(--color-foreground)"  />
            <Image src='/icons/search_dark.png' alt='search-icon' width={20} height={20} className='mr-4'/>
        </div>

        <div></div>
    </header>
  )
}

export default Header
