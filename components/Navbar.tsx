import Image from 'next/image'
import Link from 'next/link'

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
  return (
    <div className='bg-bg-dark h-full rounded-2xl flex flex-col gap-2 px-2 py-5'>

        <div className='px-3'>
            <Image src='/icons/list_dark.png' alt='list-icon' width={24} height={24}  />
        </div>

        {link_items.map((item) => (
        <Link key={item.id} href={item.href} className='flex gap-4 text-base py-1 px-4 mt-4 hover:bg-(--bg-light) rounded-2xl'>
           <Image src={item.icon} alt='home-icon' width={24} height={24}/>
           <span>{item.label}</span>
        </Link>
        ))}

    </div>
  )
}

export default Navbar
