import React, { useContext, useEffect, useState } from 'react';
import './VerticalCardApp.css'; // Import CSS file for styling
import { AppContext } from '../../AppContext';
import { useNavigate } from 'react-router-dom';
import { retrieveVideos } from '../../Firebase/functions';
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


  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  // Sample data of video objects
  const [videoData, setVideoData] = useState([
    { id: 1, videoTitle: "Video 1", videoStatus: "Uploaded", videoURL: "https://www.youtube.com/watch?v=6n3pFFPSlW4" },
  ]);


  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    console.log("videos")
    retrieveVideos(user.uid).then((response) => {
      // filter out only the interpolated videos in the response
      const videos = [];
      response.forEach((videoPair) => {
        videoPair.forEach((video) => {
          if (video.toString().includes("interpolated")) {
            videos.push(video);
          }
        }
        );
        videos.forEach((video, index) => {
          setVideoData([...videoData, { id: index, videoTitle: `Video ${index + 1}`, videoStatus: "Processed" }]);
        });
      });
    });
  }, [user]);

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
