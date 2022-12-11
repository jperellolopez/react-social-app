import React, {useState} from 'react'
import { Route, Routes } from 'react-router-dom'
import { Navbar, Feed, PinDetail, CreatePin, Search } from '../components'

// user comes from Home component
const Pins = ({user}) => {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className='px-2 md:px-5'>
      <div className='bg-gray-50'>
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user} />
      </div>
      <div className='h-full'>
      {/*Links shown in the Pin section. 
      A route preceded with ":" is a dynamic parameter, meaning that it can be accesed with the useParams hook */}
        <Routes>
          <Route path='/' element={<Feed/>} />
          <Route path='/category/:categoryId' element={<Feed/>} />
          <Route path='/pin-detail/:pinId' element={<PinDetail user={user}/>} />
          <Route path='/create-pin' element={<CreatePin user={user} />} />
          <Route path='/search' element={<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
        </Routes>
      </div>
    </div>
  )
}

export default Pins