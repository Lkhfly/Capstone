"use client";

import React from 'react'
import { useAuth } from '../contexts/auth'

const Home = () => {
    const { currentUser } = useAuth()
    return (
        <div className='text-2xl font-bold pt-14'>Hello {currentUser} you are now logged in.</div>
    )
}

export default Home