import React from 'react';
import './downloadpage.css';
import React, { useState, useEffect } from 'react';


// const DownloadPage = () => {
//   return (
//     <div className='downpage-container'>
//       <div className='downpage-home'>
//         <video width="800" height="600" controls id="result">
//           <source src="public/test2.mp4" type="video/mp4" />
//           Your browser does not support the video tag.
//         </video>
//       </div>
//     </div>
//   );
// };

// export default DownloadPage;



// chatgpt
import React, { useState, useEffect } from 'react';

const DownloadPage = () => {
  const [videoBlob, setVideoBlob] = useState(null);

  useEffect(() => {
    // Make an API call to fetch the video
    fetch('your-api-endpoint')
      .then(response => response.blob())
      .then(blob => {
        // Set the received video blob
        setVideoBlob(blob);
      })
      .catch(error => {
        console.error('Error fetching video:', error);
      });
  }, []);

  return (
    <div>
      <div>
        {videoBlob ? (
          <video width="320" height="240" controls>
            <source src={URL.createObjectURL(videoBlob)} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <p>Loading video...</p>
        )}
      </div>
    </div>
  );
};

export default DownloadPage;
