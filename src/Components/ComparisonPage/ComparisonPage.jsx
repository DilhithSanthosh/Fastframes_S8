import React, { useEffect } from 'react';
import './ComparisonPage.css';
// import './CompareTest.css';
import { useRef, useState, useContext, } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../../AppContext';


const ComparisonPage = () => {
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [video1, setVideo1] = useState(null);
  const [video2, setVideo2] = useState(null);
  const { user } = useContext(AppContext);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }

    if (location.state) {
      console.log(location.state);
      video1Ref.current.src = location.state.originalURL;
      video2Ref.current.src = location.state.interpolatedURL;
    }

  }, [user]);


  const handleStartVideos = () => {
    if (video1Ref.current && video2Ref.current) {
      video1Ref.current.play();
      video2Ref.current.play();
    }
  };

  const handleResetVideos = () => {
    if (video1Ref.current && video2Ref.current) {
      video1Ref.current.pause();
      video1Ref.current.currentTime = 0;
      video2Ref.current.pause();
      video2Ref.current.currentTime = 0;
    }
  };


  return (
    <div className="video-page-container">
      <div className="video-container">
        <div className="video-wrapper">
          <div className="video-title">ORIGINAL VIDEO</div>
          <video ref={video1Ref} controls width="850" height="640">
            <source src={video1} />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="video-wrapper">
          <div className="video-title">ENHANCED VIDEO</div>
          <video ref={video2Ref} controls width="850" height="640">
            <source src={video2} />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      <div className="button-container">
        <button className="compare-btn" onClick={handleStartVideos}>Start Videos</button>
        <button className="compare-btn" onClick={handleDownload}>Download</button>
        <button className="compare-btn" onClick={handleResetVideos}>Reset Videos</button>

      </div>

    </div>

  );
};

const handleDownload = () => {
  // Implement download functionality here
  alert('Downloading videos...');
};

export default ComparisonPage;



