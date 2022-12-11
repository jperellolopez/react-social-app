import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { MdDownloadForOffline } from 'react-icons/md'
import { AiTwotoneDelete } from 'react-icons/ai'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'
import { client, urlFor } from '../client'
import { fetchUser } from '../utils/fetchUser'

// destructuring individual props of the passed pin
const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
    const [postHovered, setPostHovered] = useState(false)
    const navigate = useNavigate()
    // Get acces to the user, with the function in the utils folder
    const user = fetchUser()
    // know if the user has already saved a specific post. 0 = not saved, 1=saved
    let alreadySaved = save?.filter((item) => item?.postedBy?._id === user?.sub);
    alreadySaved = alreadySaved?.length > 0 ? alreadySaved : [];

    const savePin = (id) => {
        if (alreadySaved?.length === 0) {
            client
                .patch(id)
                .setIfMissing({ save: [] })
                .insert('after', 'save[-1]', [
                    {
                        _key: uuidv4(),
                        userId: user?.sub,
                        postedBy: {
                            _type: 'postedBy',
                            _ref: user?.sub,
                        }
                    }])
                .commit()
                .then(() => {
                    window.location.reload()
                })
        }
    }

    const deletePin = (id) => {
        client
            .delete(id)
            .then(() => {
                window.location.reload()
            })
    }

    return (
        <div className='m-2'>
            {/* Properties of the div containing the image.  */}
            <div
                onMouseEnter={() => setPostHovered(true)}
                onMouseLeave={() => setPostHovered(false)}
                // click on the image and direct to the detail page
                onClick={() => navigate(`/pin-detail/${_id}`)}
                className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
            >

                {/*  urlFor is sanity's way to fetch an image */}
                <img src={urlFor(image).width(250).url()} className='rounded-lg w-full' alt='user-post' />

                {/*  what happens if the post is hovered*/}
                {postHovered && (
                    <div
                        className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50'
                        style={{ height: '100%' }}
                    >
                        <div className='flex items-center justify-between'>
                            <div className='flex gap-2'>
                                {/* Download link with the icon inside. e.stopPropagation prevents from being redirected to the pin detail page when we click on the download icon*/}
                                <a
                                    href={`${image?.asset?.url}?dl=`}
                                    download
                                    onClick={(e) => e.stopPropagation()}
                                    className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
                                >
                                    <MdDownloadForOffline />

                                </a>
                            </div>
                            {/* Button showing how many people saved the post */}
                           <></>
                        </div>
                        {/* Button leading to the destination (bottom left) */}
                        <div className='flex justify-between items-center gap-2 w-full'>
                            {destination && (
                                <a
                                    href={destination}
                                    rel='noreferrer'
                                    target='_blank'
                                    className='bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md'
                                >
                                    <BsFillArrowUpRightCircleFill />
                                    {destination.length > 15 ? `${destination.slice(0,15)}...` : destination}
                                </a>
                            )}
                            {/* delete pin (bottom right) */}
                            {postedBy?._id === user?.sub && (
                                <button
                                    type='button'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        deletePin(_id)
                                    }}
                                    className="bg-white p-2 rounded-full w-8 h-8 flex items-center justify-center text-dark opacity-75 hover:opacity-100 outline-none"
                                >
                                    <AiTwotoneDelete />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {/* who posted the image */}
            <Link to={`user-profile/${postedBy?._id}`} className='flex gap-2 mt-2 items-center'>
                <img
                    className="w-8 h-8 rounded-full object-cover"
                    src={postedBy?.image}
                    alt="user-profile"
                />
                <p className="font-semibold capitalize">{postedBy?.userName}</p>
            </Link>
        </div>
    )
}

export default Pin