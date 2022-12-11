import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { client } from '../client'
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'
import { feedQuery, searchQuery } from '../utils/data'


const Feed = () => {
  const [loading, setLoading] = useState(false)
  const { categoryId } = useParams()
  const [pins, setPins] = useState(null)

  
  useEffect(() => {
    setLoading(true) //set loading to true when fetching a category, spinner will appear

    if (categoryId) { // then if category exists make a sanity query named "searchQuery" located in utils/data.js. Use the collected data to set the pins and stop the loading animation.
      const query = searchQuery(categoryId)
      client.fetch(query)
        .then((data) => {
          setPins(data)
          setLoading(false)
        })
    } else { // else if category doesn't exists make a query to show all the pins.
        client.fetch(feedQuery)
          .then((data) => {
            setPins(data)
            setLoading(false)
          })
    }
  }, [categoryId]) // call the hook everytime the category Id changes

  if (loading) return <Spinner message='Añadiendo nuevo contenido' />
  if (!pins?.length) return <h2  className=' mb-5 flex flex-col text-center items-center'>Esta categoría todavía no tiene publicaciones.</h2>
  return (
    <div>
      {pins && <MasonryLayout pins={pins}/>} {/* If pins exist show them in a masonry layout */}
    </div>
  )
}

export default Feed