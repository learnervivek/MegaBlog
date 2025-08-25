import React from 'react'
import Container from "../container/Container"
import Logo from "./Logo"
import {Link} from "react-router-dom"
import LogoutBtn from './LogoutBtn'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'


function Header() {
    const authStatus = useSelector((state) => state.auth.status)
    const navigate = useNavigate()

    const navItems = [
        {
            name: "Home",
            slug: "/",
            active: true
        },
        {
            name: "Login",
            slug: "/login",
            active: !authStatus
        },
        {
            name: "Signup",
            slug: "/signup",
            active: !authStatus
        },
        {
            name: "All Posts",
            slug: "/all-posts",
            active: authStatus
        },
        {
            name: "Add Post",
            slug: "/add-post",
            active: authStatus
        }
    ]

  return (
    <header className='relative py-4 shadow-lg bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 backdrop-blur-sm border-b border-white/10'>
        <div className="absolute inset-0 bg-black/10"></div>
        <Container>
            <nav className='flex items-center justify-between relative z-10'>
                <div className='flex items-center space-x-4'>
                    <Link to="/" className="transform hover:scale-105 transition-transform duration-200">
                        <Logo />
                    </Link>
                    <div className="hidden md:block">
                        <h1 className="text-white font-bold text-xl bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                            MegaBlog
                        </h1>
                    </div>
                </div>
                
                <ul className='flex items-center space-x-2'>
                    {
                        navItems.map((item) => item.active && (
                            <li key={item.name}>
                                <button
                                onClick={() => navigate(item.slug)}
                                className='relative px-4 py-2 text-white font-medium rounded-lg transition-all duration-300 hover:bg-white/20 hover:shadow-lg hover:scale-105 active:scale-95 backdrop-blur-sm border border-white/10 hover:border-white/30'
                                >
                                    <span className="relative z-10">{item.name}</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                                </button>
                            </li>
                        ))
                    }
                    {authStatus && (
                        <li>
                            <LogoutBtn />
                        </li>
                    )}
                </ul>
            </nav>
        </Container>
    </header>
  )
}

export default Header