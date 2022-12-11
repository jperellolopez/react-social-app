// connects frontend and backend
import sanityClient from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// to find the projectId use 'sanity manage' command and look into "project id".
// to find the token do the same and go to "API" section, then "tokens", then "add API token", then name it and select "editor", then save and copy. 
// Also in the tokens section create CORS origins on localhost:3000 (check allow credentials)
// 
export const client = sanityClient({
    projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
    dataset: 'production',
    apiVersion: '2021-11-16',
    useCdn: true, 
    token: process.env.REACT_APP_SANITY_TOKEN
})

const builder = imageUrlBuilder(client)

export const urlFor = (source) => builder.image(source)