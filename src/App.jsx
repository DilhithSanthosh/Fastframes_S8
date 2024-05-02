import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar'
import Hero from './Components/Hero/Hero'
import FileUpload from './Components/FileUpload/FileUpload'
import LoginSignup from './Components/LoginSignup/LoginSignup'
import DownloadPage from './Components/downloadpage/Downloadpage'
import ComparisonPage from './Components/ComparisonPage/ComparisonPage'

const App = () => {
  return (
    <div>
      {/* <Router>
        <Routes>
        <Route path='/' element={<><Navbar/><Hero/></>}></Route>
        <Route path='/login' element={<LoginSignup/>}></Route>
        <Route path='/fileupload' element={<FileUpload/>}></Route>
        <Route path='/downloadpage' element={<DownloadPage/>}></Route>
        
        </Routes>
      
      </Router> */}

      {/* <Navbar/> */}
      {/* <Hero/> */}
      {/* <LoginSignup/> */}
      {/* <FileUpload/> */}
      <ComparisonPage/>
      {/* <DownloadPage/> */}
      
    </div>
  )
}

export default App
