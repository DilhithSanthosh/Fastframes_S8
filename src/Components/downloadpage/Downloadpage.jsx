import React from 'react';
import { useLocation } from 'react-router-dom';
import './downloadpage.css';

const DownloadPage = () => {
  // Use useLocation hook to access location state
  const location = useLocation();
  const videoBlob = location.state?.videoBlob;

  // console.log(videoBlob);

  return (
    <div className='downpage-container'>
      <div className='downpage-home'>
        {/* Check if videoBlob exists and render the video accordingly */}
        {videoBlob ? (
          <video width="800" height="600" controls id="result">
            <source src={URL.createObjectURL(new Blob([videoBlob]))} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <p>No video available</p>
        )}
      </div>
    </div>
  );
};

export default DownloadPage;
