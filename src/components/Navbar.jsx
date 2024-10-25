import React from 'react'
import gitLogo from '../assets/gitLogo.png'
const Navbar = () => {
  return (
    <>
    <nav className='sticky'>
        <ul className='flex py-2 bg-blue-950 justify-around  items-center'>
            <li className='text-xl font-bold text-green-600 hover:cursor-pointer hover:font-extrabold'>&lt;<span className='text-white '>Lock</span>Safe/&gt;</li>
            <a href="https://github.com/chiragjain24"  target="_blank">
            <div className=' px-3  rounded-xl bg-green-600 text-white hover:cursor-pointer hover:bg-green-700 flex items-center justify-center gap-1'>
                <img src={gitLogo} className='w-10' alt="" />
                <li className='text-lg'>Github</li>
            </div>
            </a>
        </ul>
    </nav>
    </>
  )
}

export default Navbar
