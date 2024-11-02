import React from 'react'
import Link from 'next/link'
import NavBardiff from '@/components/Navbardiff'

function Homena() {
  return (
    <div className='homediff h-screen'>
      < NavBardiff></ NavBardiff>
      <div className='flex flex-row w-[100%] h-[80%] items-center justify-center '>
        <div className='w-[90%] h-[50%] flex flex-row gap-[3rem] items-center justify-center'>
          <Link href="/integrateanddiff/integrat/singletrapezoidal" className='h-[100%] w-[100%]'>
            <button className='intebuttun h-[100%] w-[100%] rounded-2xl shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] hover:shadow-2xl'>
            </button>
          </Link>
          <Link href="/integrateanddiff/difference/first" className='h-[100%] w-[100%]'>
            <button className='diffbuttun h-[100%] w-[100%] rounded-2xl shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] hover:shadow-2xl'>
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Homena
