import React, { useRef, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FileUpload.css";
import axios from "axios";
import clapperboard_icon from '../../assets/clapperboard1.png';
import { generateVerificationToken, successToast, errorToast } from "../../Firebase/functions";
import { AppContext } from "../../AppContext";

import logo from '../../assets/FF_NEW1.png'
import { Link } from 'react-router-dom'

const FileUpload = () => {
  const inputRef = useRef();
  const navigate = useNavigate();

  const backendUrl = "http://localhost:8000";

  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("select");
  const [originalURL, setOriginalURL] = useState("");
  const [interpolatedURL, setInterpolatedURL] = useState("");
  const [videoUID, setVideoUID] = useState(null);
  const { user } = useContext(AppContext);

  const [interpolationFactor, setInterpolationFactor] = useState(2);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  const clearFileInput = () => {
    inputRef.current.value = "";
    setSelectedFile(null);
    setProgress(0);
    setUploadStatus("select");
  };

  const handleUpload = async () => {
    if (uploadStatus === "done") {
      clearFileInput();
      navigate('/compare', { state: { originalURL: originalURL, interpolatedURL: interpolatedURL, videoUID: videoUID } });
      return;
    }

    try {
      setUploadStatus("uploading");

      const formData = new FormData();
      formData.append("file", selectedFile);

      // generate auth token
      let token = "";
      try {
        token = await generateVerificationToken();
      } catch (error) {
        errorToast("Failed to generate token");
        setUploadStatus("select");
        return;
      }



      // send video to server
      let response = null;
      try {
        response = await axios.post(
          `${backendUrl}/video`,
          formData,
          {
            responseType: 'application/json',
            headers: {
              "Content-Type": "multipart/form-data",
              "interpolationFactor": interpolationFactor,
              "Authorization": `${token}`,
            },
            onUploadProgress: (progressEvent) => {
              setProgress(
                Math.round((progressEvent.loaded / progressEvent.total) * 100)
              );
            },
          }
        );
        successToast("Video uploaded successfully");
      } catch (error) {
        errorToast("Failed to upload video");
        setUploadStatus("select");
        return;
      }


      // get the video URLs
      try {
        console.log(response.data);
        const { original_video_url, interpolated_video_url } = response.data;
        setOriginalURL(original_video_url);
        setInterpolatedURL(interpolated_video_url);
        setVideoUID(response.data.video_id);
      } catch (error) {
        errorToast("Failed to get video URLs");
        setUploadStatus("select");
        return;
      }

      console.log("done");
      setUploadStatus("done");
    } catch (error) {
      console.log(error);
      setUploadStatus("select");
    }
  };

  useEffect(() => {
    if (!user
    ) {
      navigate('/login');
    }
  }, [user]);


  return (
    <>
      <div className="fileupload">
      <Link to='/'><img className="fastframe-home-fileupload" src={logo} alt="fastframeslogo" /></Link>
        <input
          ref={inputRef}
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {/* Button to trigger the file input dialog */}
        {!selectedFile && (
          <button className="file-btn" onClick={onChooseFile}>
            <img src={clapperboard_icon} alt="" />
            <span className="material-symbols-outlined">upload</span> Upload File
          </button>
        )}

        {selectedFile && (
          <>
            <div className="file-card">
              <span className="material-symbols-outlined icon">description</span>

              <div className="file-info">
                <div style={{ flex: 1 }}>
                  <h6 className="fileupload-dil-text">{selectedFile?.name}</h6>

                  <div className="progress-bg">
                    <div className="progress" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                {uploadStatus === "select" ? (
                  <button onClick={clearFileInput}>
                    <span className="material-symbols-outlined close-icon">
                      close
                    </span>
                  </button>
                ) : (
                  <div className="check-circle">
                    {uploadStatus === "uploading" ? (
                      `${progress}%`
                    ) : uploadStatus === "done" ? (
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "20px" }}
                      >
                        check
                      </span>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
            <button className="upload-btn" onClick={handleUpload}>
              {uploadStatus === "select" || uploadStatus === 'uploading' ? "Upload" : "Done"}
            </button>
          </>
        )}

      </div>
      <div className="file-dil">
        <button className={interpolationFactor === 2 ? "file-dilbutton-active file-dilbutton" : "file-dilbutton"} onClick={() => setInterpolationFactor(2)}>2x</button>
        <button className={interpolationFactor === 3 ? "file-dilbutton-active file-dilbutton" : "file-dilbutton"} onClick={() => setInterpolationFactor(3)}>3x</button>
        <button className={interpolationFactor === 4 ? "file-dilbutton-active file-dilbutton" : "file-dilbutton"} onClick={() => setInterpolationFactor(4)}>4x</button>
      </div>
    </>
  );
};

export default FileUpload;