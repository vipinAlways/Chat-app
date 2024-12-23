'use client'
import React from 'react'
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