import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from '@react-oauth/google'
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';
import jwt_decode from 'jwt-decode'
import { client } from '../client';


const Login = () => {
  const navigate = useNavigate()
  const responseGoogle = (response) => {
    const decode = jwt_decode(response.credential)
    localStorage.setItem('user', JSON.stringify(decode))
    // destructuring properties of profileObj
    const {name, sub, picture} = decode

    // object with the fields of the user schema. Passes to the backend through the src/client.js file
    const doc = {
      _id: sub,
      _type: 'user',
      userName: name,
      image: picture
    }

    // only create a new doc object if current one does not exists in the database. It will navigate to the root route after storing the data
    client.createIfNotExists(doc)
      .then(() => {
        navigate('/', {replace: true})
      })
  }

  return (
    /* Wrap everything into a GoogleOAuthProvider label with the id generated at:
     https://console.cloud.google.com/ and stored in env.development file
    */
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}>
      <div className='flex justify-start items-center flex-col h-screen'>
        <div className='relative w-full h-full'>
          {/* Background video */}
          <video
            src={shareVideo}
            type='video/mp4'
            loop
            controls={false}
            muted
            autoPlay
            className='w-full h-full object-cover'
          />

          <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
            {/* App logo */}
            <div className='p-5'>
              <img src={logo} width="130px" alt='logo' />
            </div>

            {/* Google Login Component */}
            <div className='shadow-2xl'>
              <GoogleLogin
                onSuccess={responseGoogle}
                onError={responseGoogle}
                cookiePolicy="single_host_origin"
              />
            </div>

          </div>

        </div>
      </div>
    </GoogleOAuthProvider>
  )
}

export default Login