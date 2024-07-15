import React, { useState, useRef } from "react";

const mimeType = "image/png";

const ReactImagePicker = () => {
  const liveVideoFeed = useRef(null);
  const canvasRef = useRef(null);
  const [permission, setPermission] = useState(false);
  const [cameraMode, setCameraMode] = useState("user");
  const [photoSrc, setPhotoSrc] = useState("");

  const getCameraPermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            width: { min: 160, ideal: 270, max: 640 },
            height: { min: 240, ideal: 480, max: 480 },
            facingMode: cameraMode,
          },
        });
        setPermission(true);
        //set videostream to live feed player
        liveVideoFeed.current.srcObject = videoStream;

        canvasRef.current.width = liveVideoFeed.current.videoWidth;
        canvasRef.current.height = liveVideoFeed.current.videoHeight;
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  const clearPhoto = () => {
    const context = canvasRef.current.getContext("2d");
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    const data = canvasRef.current.toDataURL("image/png");
    setPhotoSrc(data);
  };
  const takePhoto = () => {
    const context = canvasRef.current.getContext("2d");
    if (liveVideoFeed.current.videoWidth && liveVideoFeed.current.videoHeight) {
      liveVideoFeed.current.pause();
      canvasRef.current.width = liveVideoFeed.current.videoWidth;
      canvasRef.current.height = liveVideoFeed.current.videoHeight;
      context.drawImage(
        liveVideoFeed.current,
        0,
        0,
        liveVideoFeed.current.videoWidth,
        liveVideoFeed.current.videoHeight
      );

      const data = canvasRef.current.toDataURL("image/png");
      setPhotoSrc(data);
    } else {
      clearPhoto();
    }
    liveVideoFeed.current.play();
  };

  const handleSubmit = async () => {
    const photoBlob = await fetch(photoSrc).then((r) => r.blob());
    const photoFile = new File([photoBlob], "photo.png", { type: mimeType });

    // Now do whatever you want to do with the image file!
  };

  return (
    <div>
      <h2>Image Capture</h2>
      <main>
        <div className="video-controls">
          {!permission && (
            <button onClick={getCameraPermission} type="button">
              Get Camera
            </button>
          )}
        </div>
        <div className="video-player">
          <canvas
            ref={canvasRef}
            id="myCanvas"
            width="400"
            height="350"
            style={{ display: "none" }}
          ></canvas>

          <>
            <video ref={liveVideoFeed} autoPlay className="live-player">
              No Media To see
            </video>
            {permission && (
              <button id="startbutton" onClick={takePhoto}>
                Take photo
              </button>
            )}
          </>
          {photoSrc && (
            <div className="recorded-player">
              <img src={photoSrc} alt="" />

              <div>
                <a download href={photoSrc}>
                  Download Photo
                </a>
              </div>
              <input type="submit" onClick={handleSubmit} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
export default ReactImagePicker;
