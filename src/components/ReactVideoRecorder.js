import { useState, useRef, useEffect } from "react";

const mimeType = "video/webm";

const ReactVideoRecorder = () => {
  const mediaRecorder = useRef(null);
  const liveVideoFeed = useRef(null);
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState(null);
  //sets the current recording status of the recorder. The three possible values are recording, inactive, and paused
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [videoChunks, setVideoChunks] = useState([]);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [timer, setTimer] = useState(0); // Add timer state
  const [startTime, setStartTime] = useState(null);
  const [cameraMode, setCameraMode] = useState("user");
  // constants
  const maxRecordingTimeSeconds = 10;

  const getCameraPermission = async () => {
    setRecordedVideo(null);
    if ("MediaRecorder" in window) {
      try {
        const videoConstraints = {
          audio: false,
          video: {
            width: { min: 160, ideal: 270, max: 640 },
            height: { min: 240, ideal: 480, max: 480 },
            facingMode: cameraMode,
          },
        };
        const audioConstraints = { audio: true };
        // create audio and video streams separately
        const audioStream = await navigator.mediaDevices.getUserMedia(
          audioConstraints
        );
        const videoStream = await navigator.mediaDevices.getUserMedia(
          videoConstraints
        );
        setPermission(true);
        //combine both audio and video streams
        const combinedStream = new MediaStream([
          ...videoStream.getVideoTracks(),
          ...audioStream.getAudioTracks(),
        ]);
        setStream(combinedStream);
        //set videostream to live feed player
        liveVideoFeed.current.srcObject = videoStream;
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  const startRecording = async () => {
    setRecordingStatus("recording");
    //create new Media recorder instance using the stream
    const media = new MediaRecorder(stream);
    //set the MediaRecorder instance to the mediaRecorder ref
    mediaRecorder.current = media;
    //invokes the start method to start the recording process
    mediaRecorder.current.start();

    // Start the timer
    setStartTime(Date.now());

    let localVideoChunks = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      localVideoChunks.push(event.data);
    };
    setVideoChunks(localVideoChunks);
  };

  const stopRecording = () => {
    setPermission(false);
    setRecordingStatus("inactive");
    setTimer(0);
    //stops the recording instance
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      //creates a blob file from the audiochunks data
      const videoBlob = new Blob(videoChunks, { type: mimeType });
      //creates a playable URL from the blob file.
      const videoUrl = URL.createObjectURL(videoBlob);
      setRecordedVideo(videoUrl);
      setVideoChunks([]);
    };
  };

  const handleSubmit = async () => {
    const videoBlob = await fetch(recordedVideo).then((r) => r.blob());
    const videoFile = new File([videoBlob], "video.webm", { type: mimeType });

    // Now send the video file to database!
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      const passedTime = startTime ? Date.now() - startTime : 0;
      setTimer(passedTime / 1000);
    }, 1000);

    if (timer >= maxRecordingTimeSeconds) {
      stopRecording();
      clearTimeout(timerId);
    }

    if (recordingStatus !== "recording") {
      // Clear timerId and stop the timer when recording ends
      clearTimeout(timerId);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [timer, startTime, recordingStatus]);

  return (
    <div>
      <h2>Video Recorder</h2>
      <main>
        <div className="video-controls">
          {!permission && (
            <button onClick={getCameraPermission} type="button">
              Get Camera
            </button>
          )}
          {permission && recordingStatus === "inactive" ? (
            <div>
              <button onClick={startRecording} type="button">
                Start Recording
              </button>
              {/* <button
                onClick={async () => {
                  setCameraMode((prev) =>
                    prev === "user" ? "environment" : "user"
                  );
                  await getCameraPermission();
                }}
              >{`${cameraMode === "user" ? "Back" : "Front"} Camera`}</button> */}
            </div>
          ) : null}
          {recordingStatus === "recording" && (
            <>
              <button onClick={stopRecording} type="button">
                Stop Recording
              </button>
              {timer <= 10 && <div>{timer} seconds</div>}
            </>
          )}
        </div>
        <div className="video-player">
          {!recordedVideo ? (
            <video ref={liveVideoFeed} autoPlay className="live-player"></video>
          ) : null}
          {recordedVideo ? (
            <div className="recorded-player">
              <video className="recorded" src={recordedVideo} controls></video>
              <div>
                <a download href={recordedVideo}>
                  Download Recording
                </a>
              </div>
              <input type="submit" onClick={handleSubmit} />
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
};
export default ReactVideoRecorder;
