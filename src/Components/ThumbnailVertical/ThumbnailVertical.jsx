import React, { useState, useContext, useEffect } from 'react';
import './ThumbnailVertical.css'; // Import CSS file for styling
import { AppContext } from '../../AppContext';
import { useNavigate } from 'react-router-dom';
import { retrieveVideos } from '../../Firebase/functions';

const VerticalCard = ({ videoTitle, videoStatus, videoURL }) => {
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
          <source src={videoURL} type="video/mp4" />
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

const loadingScreen = () => {
  return <div>
    <h1>Loading...</h1>
  </div>
}
// Vertical Card App component
function ThumbnailVertical() {
  // Sample data of video objects

  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  const [videoData, setVideoData] = useState([
  ]);


  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    console.log("videos")
    retrieveVideos(user.uid).then((response) => {
      // filter out only the interpolated videos in the response
      const videos = [];
      const videoData = [];
      response.forEach((videoPair) => {
        videoPair.forEach((video) => {
          if (video.toString().includes("interpolated")) {
            console.log(video);
            videos.push(video);
          }
        });
      });
      videos.forEach((video) => {
        const videoTitle = "Video";
        videoData.push({
          videoTitle: videoTitle,
          videoStatus: "Done",
          videoURL: video,
        });
      });
      setVideoData(videoData);
    });
  }, [user]);

  return (
    <div className="vertical-card-app-TV">
      <h1 className="vertical-card-app-title-TV">Video Upload Status</h1>
      {(videoData.length == 0) ? loadingScreen() : videoData.map((video, index) => (
        <VerticalCard key={index} videoTitle={`${video.videoTitle} ${index + 1}`} videoStatus={video.videoStatus} videoURL={video.videoURL} />
      ))}
    </div>
  );
}

export default ThumbnailVertical;
