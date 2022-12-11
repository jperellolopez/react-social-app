import React, { useState, useEffect } from 'react'
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
// uuidv4 used to gave every comment an individual id
import { v4 as uuidv4 } from 'uuid';
import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';
import Spinner from './Spinner';

const PinDetail = ({ user }) => {
  // pinId is set as a dynamic parameter in the container pins.jsx route, so it is fetched with the useParams hook
  const { pinId } = useParams()
  const [pins, setPins] = useState(null)
  const [pinDetail, setPinDetail] = useState(null)
  const [comment, setComment] = useState('')
  const [addingComment, setAddingComment] = useState(false)

  console.log(pinId)
  // fetch pin details from the db
  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId)
    if (query) {
      client.fetch(query)
        .then((data) => {
          setPinDetail(data[0])

          // reassign the query if pin already exists, so it gets all the similar pins (similar titles, categories...) as recommendations
          if (data[0]) {
            query = pinDetailMorePinQuery(data[0])

            client.fetch(query)
              .then((res) => setPins(res))
          }
        })
    }
  }

  useEffect(() => {
    fetchPinDetails()
  }, [pinId]) // the useffect changes when pinId changes


  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [{ comment, _key: uuidv4(), postedBy: { _type: 'postedBy', _ref: user._id } }])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment('');
          setAddingComment(false);
        });
    }
  };

  console.log(pinDetail)
  // there should not be conditionals before any useEffect hook
  if (!pinDetail) { return (<Spinner message="Cargando imagen..." />); }

  return (
    <>
      <div className="flex xl:flex-row flex-col m-auto bg-white" style={{ maxWidth: '1500px', borderRadius: '32px' }}>
        <div className="flex justify-center items-center md:items-start flex-initial">
          <img
            className="rounded-t-3xl rounded-b-lg"
            src={(pinDetail?.image && urlFor(pinDetail?.image).url())}
            alt="user-post"
          />
        </div>
        <div className="w-full p-5 flex-1 xl:min-w-620">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              Descarga: <a
                href={`${pinDetail.image.asset.url}?dl=`}
                download
                className="bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100"
              >
                <MdDownloadForOffline />
              </a>
            </div>
            <a href={pinDetail.destination} target="_blank" rel="noreferrer">
              Desde:  {pinDetail.destination.length > 40 ? `${pinDetail.destination.slice(0,40)}...` : pinDetail.destination}
            </a>
          </div>
          <div>
            <h1 className="text-4xl font-bold break-words mt-3">
              {pinDetail.title}
            </h1>
            <p className="mt-3">{pinDetail.about}</p>
          </div>
          <Link to={`/user-profile/${pinDetail?.postedBy._id}`} className="flex gap-2 mt-5 items-center bg-white rounded-lg ">
            <img src={pinDetail?.postedBy.image} className="w-10 h-10 rounded-full" alt="user-profile" />
            <p className="font-bold">{pinDetail?.postedBy.userName}</p>
          </Link>
          <h2 className="mt-5 text-2xl">Comentarios</h2>
          <div className="max-h-370 overflow-y-auto">
            {pinDetail?.comments?.map((comment, k) => (
              <div className="flex gap-2 mt-5 items-center bg-white rounded-lg" key={k}>
                <img
                  src={comment.postedBy?.image}
                  className="w-10 h-10 rounded-full cursor-pointer"
                  alt="user-profile"
                />
                <div className="flex flex-col">
                  <p className="font-bold">{comment.postedBy?.userName}</p>
                  <p>{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap mt-6 gap-3">
            <Link to={`/user-profile/${user._id}`}>
              <img
                src={user.image}
                className="w-10 h-10 rounded-full cursor-pointer"
                alt="user-profile"
              />
            </Link>
            <input
              className=" flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
              type="text"
              placeholder="Añade un comentario"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type="button"
              className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
              onClick={addComment}
            >
              {addingComment ? 'Añadiendo comentario...' : 'Comentar'}
            </button>
          </div>
        </div>
      </div>
      {pins?.length > 0 ? (
        <>
          <h2 className='text-center font-bold text-2xl mt-8 mb-4'>
            Contenido similar:
          </h2>
          <MasonryLayout pins={pins}/>
        </>
      ) : (
        <h2 className='text-center font-bold text-2xl mt-8 mb-4'>
            No hemos encontrado más publicaciones de este tipo
          </h2>
      )}
    </>
  )
}

export default PinDetail