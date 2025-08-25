import React from 'react'
import appwriteService from "../appwrite/config.js"
import {Link} from 'react-router-dom'


function Postcard({ $id,title ,featureimage}) {
  console.log('Postcard featureimage:', featureimage);
  const imageUrl = appwriteService.getFileView(featureimage);
  console.log('Postcard imageUrl:', imageUrl);
  
  return (
   <Link to={`/post/${$id}`}>
    <div className='w-full bg-gray-100 rounded-xl p-4'>
        <div className='w-full justify-center mb-4'> 
           <img 
             src={imageUrl} 
             alt={title} 
             className='rounded-xl w-full h-48 object-cover' 
             onError={(e) => {
               console.error('Image failed to load:', imageUrl);
               e.target.style.display = 'none';
               e.target.nextSibling.style.display = 'block';
             }}
             onLoad={() => console.log('Image loaded successfully:', imageUrl)}
           />
           <div className="rounded-xl w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500" style={{display: 'none'}}>
             Image not available
           </div>
        </div>
        <h2 className='text-xl font-bold'>{title}</h2>
    </div>

   </Link>
  )
}

export default Postcard
