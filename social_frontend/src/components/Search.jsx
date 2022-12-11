import React, { useState, useEffect } from 'react'
import MasonryLayout from './MasonryLayout'
import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';
import Spinner from './Spinner';

const Search = ({ searchTerm }) => {
  const [pins, setPins] = useState(null)
  const [loading, setLoading] = useState(false)

  //useffect for search function. It will display images with the provided text in title or description
  useEffect(() => {
    if (searchTerm) {
      setLoading(true)
      const query = searchQuery(searchTerm.toLowerCase())
      client.fetch(query)
        .then((data) => {
          setPins(data)
          setLoading(false)
        })
    } else { // if theres no search term, display all pins
      client.fetch(feedQuery)
        .then((data) => {
          setPins(data)
          setLoading(false)
        })
    }
  }, [searchTerm]) //changes when the search term changes

  return (
    <div>
      {loading && <Spinner message='Buscando publicaciones...' />}
      {pins?.length !== 0 && <MasonryLayout pins={pins} />}
      {pins?.length === 0 && searchTerm !== '' && !loading && (
        <div className='mt-10 text-center text-xl'>
          No se han encontrado publicaciones.
        </div>
      )}
    </div>
  )
}

export default Search