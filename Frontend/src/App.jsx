import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axiosInstance from './utils/axiosConfig'
import { Outlet } from 'react-router-dom'
import './index.css';

function App() {

  return (
    <div className=' flex  h-screen w-screen font-noto-sans'>
      <Outlet/>
    </div>
  )
}

export default App
