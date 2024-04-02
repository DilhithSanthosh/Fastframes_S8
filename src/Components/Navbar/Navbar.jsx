import React from 'react'
import './Navbar.css'
import logo from '../../assets/FF_NEW1.png'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className='container-navbar'>
            {/* <a href="index.html"><img src={logo} alt="fastframeslogo"/></a> */}
            <Link to='/'><img src={logo} alt="fastframeslogo"/></Link>

            <div className="nav-links">
                <ul className="nav-links-ul">
                    {/* <Link to='login'>Sign In</Link> */}
                    {/* <li><a href="">HOME</a></li>
                    <li><a href="">ABOUT US</a></li>
                    <li><a href="">INSTRUCTIONS</a></li>
                    <li><a href="">CONTACT</a></li> */}
                    <li><a href="">HOME</a></li>
                    <li><a href="">ABOUT US</a></li>
                    <li><a href="">INSTRUCTIONS</a></li>
                    <li><Link to='login'>SIGN IN</Link></li>
                </ul>
            </div>
    </nav>
  )
}

export default Navbar
