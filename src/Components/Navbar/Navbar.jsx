import React, { useContext } from 'react'
import './Navbar.css'
import logo from '../../assets/FF_NEW1.png'
import { Link } from 'react-router-dom'
import { AppContext } from '../../AppContext'
import { logout, successToast, errorToast } from '../../Firebase/functions'

const handleSignOut = () => { // handle logout
  logout().then((response) => {
    if (response) {
      successToast("User logged out successfully.");
    } else {
      errorToast("An error occurred. Please try again.");
    }
  });
}

const Navbar = () => {
  const { user } = useContext(AppContext);
  return (
    <nav className='container-navbar'>
      {/* <a href="index.html"><img src={logo} alt="fastframeslogo"/></a> */}
      <Link to='/'><img src={logo} alt="fastframeslogo" /></Link>

      <div className="nav-links">
        <ul className="nav-links-ul">
          <li><a href="">HOME</a></li>
          <li><Link to='aboutus'>ABOUT US</Link></li>
          <li><Link to='verticalcard'>INSTRUCTIONS</Link></li>
          {(user) ? <li onClick={handleSignOut} >LOG OUT</li> : <li><Link to='login'>SIGN IN</Link></li>}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
