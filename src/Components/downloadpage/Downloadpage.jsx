import React, { useEffect, useRef, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import './downloadpage.css';
import { AppContext } from '../../AppContext';

const DownloadPage = () => {
  // Use useLocation hook to access location state
  const location = useLocation();
  const videoRef = useRef(null);
  const url = location.state?.videoURL;
  const { user } = useContext(AppContext);

  // size of blob
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    if (location.state) {
      videoRef.current.src = location.state.videoURL;
    } else {
      console.log("No video found");
    }
  }, []);


  // console.log(videoBlob);

  return (
    <div className='downpage-container'>
      <div className='downpage-home'>
        {/* Check if videoBlob exists and render the video accordingly */}
        {videoBlob ? (
          <video width="800" height="600" controls id="result">
            <source ref={videoRef} src={url} />
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
