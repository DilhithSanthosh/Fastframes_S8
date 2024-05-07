import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './NewDownloadPage.css';

const NewDownloadPage = () => {
  const videoRef = useRef(null);
  const [videoSrc, setVideoSrc] = useState(null);
  const [videoUID, setVideoUID] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // get the video UID from location state
    if (location.state) {
      setVideoUID(location.state.videoUID);
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

  const handleDownloadVideo = () => {
    // Replace 'video.mp4' with the actual video file URL
    const a = document.createElement('a');
    a.href = videoSrc;
    a.download = 'final_video.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
        <button className="compare-btn-DownloadPage" onClick={handleDownloadVideo}>Download</button>
        <button className="compare-btn-DownloadPage" onClick={handleCompareVideo}>Compare</button>
        <button className="compare-btn-DownloadPage" onClick={handleResetVideo}>Reset Video</button>
      </div>
    </div>
  );
};

export default NewDownloadPage;
