import React from 'react'
import './Hero.css'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className='hero'>
        <div className="text-box">
        <h1>Frame Rate Enhancer</h1>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis impedit repellat, ad itaque possimus alias.</p>
        {/* <a href="" className="hero-btn">Click Here To Enhance</a> */}
        <Link to='fileupload' className="hero-btn">Click Here To Enhance</Link>
        

        </div>
      
    </div>
  )
}

export default Hero
