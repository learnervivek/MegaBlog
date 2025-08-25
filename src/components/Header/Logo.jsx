import React from 'react'
import logoImage from '../../assets/logo.png'

function Logo({ width='50px'}) {
  return (
    <div style={{ width }}>
      <img 
        src={logoImage} 
        alt="MEGA BLOG Logo" 
        className="h-auto w-full object-contain"
      />
    </div>
  )
}

export default Logo
