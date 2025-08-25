import React,{useState,useEffect} from 'react'
import { useDispatch } from 'react-redux'
import './App.css'
import authService from './appwrite/auth'
import {login,logout} from "./store/authSlice"
import{Footer,Header} from './components'
import { Outlet } from 'react-router-dom'






function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }))
        } else {
          dispatch((logout()))
        }
      })
      .finally(()=>{
        setLoading(false);
      });
  }, [dispatch])

 return !loading?(
<div className='min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'>
  {/* Background Pattern */}
  <div className="fixed inset-0 opacity-30 pointer-events-none">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(99,102,241,0.1),transparent_50%)]"></div>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(168,85,247,0.1),transparent_50%)]"></div>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
  </div>
  
  <div className='w-full flex flex-col min-h-screen relative z-10'>
    <Header/>
    <main className="flex-1 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/50 pointer-events-none"></div>
      <div className="relative z-10">
        <Outlet/>
      </div>
    </main>
    <Footer/>
  </div>
</div>
 ):null
}

export default App
