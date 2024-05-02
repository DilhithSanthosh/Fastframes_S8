import React from 'react';
import './ComparisonPage.css';

const ComparisonPage = () => {
  return (
    <div className="video-page-container">
      <div className="video-container">
        <div className="video-wrapper">
          <video controls width="720" height="540">
            <source src="public/test1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="video-wrapper">
          <video controls width="720" height="540">
            <source src="public/test2.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      <div className="button-container">
        <button className= "compare-btn" onClick={handleDownload}>Download</button>
      </div>
    </div>
    
  );
};

const handleDownload = () => {
  // Implement download functionality here
  alert('Downloading videos...');
};

export default ComparisonPage;



