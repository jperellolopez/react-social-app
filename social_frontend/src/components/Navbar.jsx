import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IoMdAdd, IoMdSearch } from 'react-icons/io'

const Navbar = ({searchTerm, setSearchTerm, user}) => {
  const navigate = useNavigate()

  // only show the search bar if user exists
  if(!user)  return null 

  {/* Search bar */}
  return (
    <div className='flex gap-2 mg:gap-5 w-full mt-5 pb-7'>
      <div className='flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm'>
        <IoMdSearch fontSize={21} className='ml-1' />
        <input
          type='text'
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder='Búsqueda'
          value={searchTerm}
          onFocus={(e) => navigate('/search')}
          className='p-2 w-full bg-white outline-none'
        />
      </div>

      {/*User profile image displayed at the right of the search bar and create pin button */}
      <div className='flex gap-3'>
        <Link to={`user-profile/${user?._id}`} className='hidden md:block'>
          <img src={user.image} alt='user' className='w-14 h-12 rounded-lg'/>
        </Link> 
        <Link to='create-pin' className='bg-black text-white rounded-lg w-12 h-12 md:w-14 md:h-12 flex justify-center items-center'>
          <IoMdAdd/>
        </Link> 
      </div>
    </div>
  )
}

export default Navbar