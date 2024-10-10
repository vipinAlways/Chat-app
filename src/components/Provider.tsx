'use client'
import React,{FC} from 'react'
import { Toaster } from './ui/toaster'



const Provider=({children}:{children:React.ReactNode})=>{
  return (
    <div>
        {children}
        <Toaster/>
    </div>
  )
}

export default Provider