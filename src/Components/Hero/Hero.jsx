import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Hero.css'
import { Link } from 'react-router-dom'
import { AppContext } from '../../AppContext'

const Hero = () => {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  return (
    <div className='hero'>
      <div className="text-box">
        <h1>Frame Rate Enhancer</h1>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis impedit repellat, ad itaque possimus alias.</p>
        {/* <a href="" className="hero-btn">Click Here To Enhance</a> */}
        <Link to={(user) ? 'fileupload' : 'login'} className="hero-btn">Click Here To Enhance</Link>
      </div>

    </div>
  )
}

export default Hero
