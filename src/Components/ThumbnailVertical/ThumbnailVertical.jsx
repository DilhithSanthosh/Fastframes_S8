import React, { useState } from 'react';
import './ThumbnailVertical.css'; // Import CSS file for styling

const VerticalCard = ({ videoTitle, videoStatus }) => {
  const playVideo = () => {
    // Add logic here to play the video
    alert(`Playing ${videoTitle}`);
  };

  return (
    <div className="vertical-card-TV">
      {/* <div className={`title-verticalcard-TV ${videoStatus.toLowerCase()}`}> */}
      <div className="title-verticalcard-TV" >
        <video controls={false} muted className="video-thumbnail-TV">
          {/* replace src with video url */}
          <source src="test8.mp4" type="video/mp4" />
        </video>
        <h2>{videoTitle}</h2>
      </div>
      <p className={`status-verticalcard-TV ${videoStatus.toLowerCase()}`}>{videoStatus}</p>
      <button className="play-btn-verticalcard-TV" onClick={playVideo}>Play</button>
      <button className="download-btn-verticalcard-TV">Compare</button>
      <button className="download-btn-verticalcard-TV">Download</button>
    </div>
  );
};

// Vertical Card App component
function ThumbnailVertical() {
  // Sample data of video objects
  const videoData = [
    { id: 1, videoTitle: "Video 1", videoStatus: "Uploaded" },
    { id: 2, videoTitle: "Video 2", videoStatus: "Processing" },
    { id: 3, videoTitle: "Video 3", videoStatus: "Uploaded" },
  ];

  return (
    <div className="vertical-card-app-TV">
      <h1 className="vertical-card-app-title-TV">Video Upload Status</h1>
      {videoData.map(video => (
        <VerticalCard key={video.id} videoTitle={video.videoTitle} videoStatus={video.videoStatus} />
      ))}
    </div>
  );
}

export default ThumbnailVertical;
