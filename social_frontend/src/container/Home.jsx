import React, { useEffect, useState, useRef } from 'react';
import { HiMenu } from 'react-icons/hi'
import { AiFillCloseCircle } from 'react-icons/ai'
import { Link, Route, Routes } from 'react-router-dom'
import { Sidebar, UserProfile, Login } from '../components';
import { client } from '../client';
import logo from '../assets/logo.png'
import Pins from './Pins';
import { userQuery } from '../utils/data';
import { fetchUser } from '../utils/fetchUser';

const Home = () => {

  const [toggleSidebar, setToggleSidebar] = useState(false)
  const [user, setUser] = useState(null)
  const scrollRef = useRef(null)

  // checks if there's a user logged in, using the function in the utils folder
  const userInfo = fetchUser()

  // userQuery is from utils/data.js. sub is the user id, it is only passed if there's a user logged in
  useEffect(() => {
    const query = userQuery(userInfo?.sub)
    client.fetch(query)
      .then((data) => {
        setUser(data[0])
      })
  }, [])

  // controls the scroll position
  useEffect(() => {
    scrollRef.current.scrollTo(0, 0)
  }, [])


  return (
    <div className='flex bg-gray-50 md:flex-row flex-col h-screen transaction-height duration-75 ease-out'>
      <div className='hidden md:flex h-screen flex-initial'>
        {/* Mobile sidebar */}
        <Sidebar user={user && user} />  {/* If user exists pass the user else pass false */}
      </div>

      <div className='flex md:hidden flex-row'>
        <div className='p-2 w-full flex flex-row justify-between items-center shadow-md'>
          <HiMenu fontSize={40} className="cursor-pointer" onClick={() => setToggleSidebar(true)} />
          <Link to="/">
            <img src={logo} alt="logo" className='w-28' />
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img src={userInfo?.picture} alt="logo" className='w-28' />
          </Link>
        </div>
        {toggleSidebar && (
          <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>
            <div className='absolute w-full flex justify-end items-center p-2'>
              <AiFillCloseCircle fontSize={30} className='cursor-pointer' onClick={() => setToggleSidebar(false)} />
            </div>
            {/* Desktop sidebar */}
            <Sidebar user={user && user} closeToggle={setToggleSidebar} /> {/* If user exists pass the user else pass false */}
          </div>
        )}
      </div>

      <div className='pb-2 flex-1 h-screen overflow-y-scroll' ref={scrollRef}>
        <Routes>
          <Route path='/user-profile/:userId' element={<UserProfile />} />
          <Route path='/*' element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  )
}

export default Home