import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar'
import Hero from './Components/Hero/Hero'
import FileUpload from './Components/FileUpload/FileUpload'
import LoginSignup from './Components/LoginSignup/LoginSignup'
import DownloadPage from './Components/downloadpage/Downloadpage'
import ComparisonPage from './Components/ComparisonPage/ComparisonPage'
import NewDownloadPage from './Components/NewDownloadPage/NewDownloadPage'
import { AppContext } from './AppContext'
import { checkAuthState } from './Firebase/functions'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import AboutUs from './Components/AboutUs/AboutUs'
import VerticalCardApp from './Components/VerticalCardApp/VerticalCardApp'
import ThumbnailVertical from './Components/ThumbnailVertical/ThumbnailVertical'

const App = () => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    // check if the user is already logged in
    checkAuthState(setUser);
  }, []);

  return (
    <div>
      <AppContext.Provider value={{ user }}>
        <Router>
          <Routes>
            <Route path='/' element={<><Navbar /><Hero /></>}></Route>
            <Route path='/login' element={<LoginSignup />}></Route>
            <Route path='/fileupload' element={<FileUpload />}></Route>
            {/* <Route path='/downloadpage' element={<DownloadPage/>}></Route> */}
            <Route path='/compare' element={<ComparisonPage />}></Route>
            <Route path='/downloadpage' element={<NewDownloadPage />}></Route>
            <Route path='/aboutus' element={<AboutUs />}></Route>
        <Route path='/verticalcard' element={<VerticalCardApp/>}></Route>
        <Route path='/thumbnail' element={<ThumbnailVertical/>}></Route>
          </Routes>

        </Router>
      </AppContext.Provider>
      {/* <Navbar/> */}
      {/* <Hero/> */}
      {/* <LoginSignup/> */}
      {/* <FileUpload/> */}
      {/* <ComparisonPage/> */}
      {/* <NewDownloadPage/> */}
      {/* <DownloadPage/> */}
      <ToastContainer />
    </div>
  )
}

export default App
