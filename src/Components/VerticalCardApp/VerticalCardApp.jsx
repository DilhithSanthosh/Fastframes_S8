import React from 'react';
import './VerticalCardApp.css'; // Import CSS file for styling

// Video component
const VerticalCard = ({ videoTitle, videoStatus }) => {
  const playVideo = () => {
    // Add logic here to play the video
    alert(`Playing ${videoTitle}`);
  };

  return (
    <div className="vertical-card">
      <p className="title-verticalcard">{videoTitle}</p>
      <p className={`status-verticalcard ${videoStatus.toLowerCase()}`}>{videoStatus}</p>
      <button className="play-btn-verticalcard" onClick={playVideo}>Play</button>
      <button className="download-btn-verticalcard">Download</button>
    </div>
  );
};

// Vertical Card App component
function VerticalCardApp() {
  // Sample data of video objects
  const videoData = [
    { id: 1, videoTitle: "Video 1", videoStatus: "Uploaded" },
    { id: 2, videoTitle: "Video 2", videoStatus: "Processing" },
    { id: 3, videoTitle: "Video 3", videoStatus: "Uploaded" },
  ];

  return (
    <div className="vertical-card-app">
      <h1 className="vertical-card-app-title">Video Upload Status</h1>
      {videoData.map(video => (
        <VerticalCard key={video.id} videoTitle={video.videoTitle} videoStatus={video.videoStatus} />
      ))}
    </div>
  );
}

export default VerticalCardApp;
