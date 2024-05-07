import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './NewDownloadPage.css';
import { useContext } from 'react';
import { AppContext } from '../../AppContext';
import { handleDownloadVideo } from '../../Firebase/functions';

const NewDownloadPage = () => {
  const videoRef = useRef(null);
  const [videoSrc, setVideoSrc] = useState(null);
  const [videoUID, setVideoUID] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AppContext);

  // size of blob
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    if (location.state) {
      setVideoSrc(location.state.videoURL);
      videoRef.current.src = location.state.videoURL;
    } else {
      console.log("No video found");
    }
  }, []);


  const handleStartVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleResetVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };



  const handleCompareVideo = () => {
    // Redirect to another webpage
    window.location.href = '/compare';
  };

  return (
    <div className="video-page-container-DownloadPage">
      <div className="video-container-DownloadPage">
        <div className="video-title-DownloadPage">Enhanced Video</div>
        <div className="video-wrapper-DownloadPage">
          <video ref={videoRef} controls width="1024" height="576" muted="muted">
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      <div className="button-container-DownloadPage">
        <button className="compare-btn-DownloadPage" onClick={handleStartVideo}>Start Video</button>
        <button className="compare-btn-DownloadPage" onClick={() => handleDownloadVideo(videoRef.current.src)}>Download</button>
        <button className="compare-btn-DownloadPage" onClick={handleResetVideo}>Reset Video</button>
      </div>
    </div>
  );
};

export default NewDownloadPage;
