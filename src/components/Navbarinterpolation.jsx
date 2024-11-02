import React from 'react'
import Link from 'next/link'

function NavBarinter() {
  return (
    <>
    <div>
      <div className='h-[6rem] bg-black rounded-b-xl grid grid-cols-4 gap-0'>
        <div className='logo flex items-center col-span-1 ml-9'>
          <img className="rounded-full h-[4rem]" src="/NUlogo.png" alt="logo"/>
          <p className='ml-5 w-[5rem] text-white text-[1.25rem]'>NumericalMethod</p>
        </div>
        <div className="flex col-span-2">
          <div className="dropdown dropdown-hover ml-[13rem]">
            <div tabIndex={0} role="button" className="btn bg-white h-[3.5rem] m-5 text-lg py-3 px-10 text-[2.5rem] font-normal w-[25rem]" >Interpolation</div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-[27rem] p-3 shadow text-lg">
            <li><Link href="/root/graphicalmethod">Root of Equation</Link></li>
            <li><Link href="/linear/cramersrule">Linear Algebra Equeation</Link></li>
            <li><Link href="/interpolation/newtondivided">Interpolation</Link></li>
              <li><a>Item 2</a></li>
              <li><a>Item 2</a></li>
              <li><a>Item 2</a></li>
            </ul>
          </div>
        </div>
        <div>
            <Link href="/"> <button className='btn bg-white mt-6 ml-[65%] text-[1rem]'>Home</button></Link>
        </div>
      </div>
    </div>
    </>
  )
}

export default NavBarinter