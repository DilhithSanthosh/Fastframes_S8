import React, { useRef } from 'react';
import './NewDownloadPage.css';

const NewDownloadPage = () => {
  const videoRef = useRef(null);

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
    const videoUrl = 'video.mp4';
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = 'video.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCompareVideo = () => {
    // Redirect to another webpage
    window.location.href = 'https://google.com';
  };

  return (
    <div className="video-page-container">
      <div className="video-container">
        <div className="video-title">Enhanced Video</div>
        <div className="video-wrapper">
          {/* <div className="video-title">Video Player</div> */}
          <video ref={videoRef} controls width="1024" height="576">
            <source src="public/test1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      <div className="button-container">
        <button className="compare-btn" onClick={handleStartVideo}>Start Video</button>
        <button className="compare-btn" onClick={handleDownloadVideo}>Download</button>
        <button className="compare-btn" onClick={handleCompareVideo}>Compare</button>
        <button className="compare-btn" onClick={handleResetVideo}>Reset Video</button>

      </div>
    </div>
  );
};

export default NewDownloadPage;
