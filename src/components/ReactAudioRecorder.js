//https://blog.logrocket.com/how-to-create-video-audio-recorder-react/#:~:text=The%20MediaRecorder%20API,-To%20record%20audio&text=To%20obtain%20a%20MediaStream%20object,captureStream()%20.

import { useState, useRef, useEffect } from "react";

const mimeType = "audio/webm";

const AudioCapture = () => {
  const mediaRecorder = useRef(null);
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState(null);
  //sets the current recording status of the recorder. The three possible values are recording, inactive, and paused
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audioChunks, setAudioChunks] = useState([]);
  const [audio, setAudio] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [timer, setTimer] = useState(0); // Add timer state
  // constants
  const maxRecordingTimeSeconds = 10;

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
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

    let localAudioChunks = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);
  };

  const stopRecording = () => {
    setRecordingStatus("inactive");
    //stops the recording instance
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      //creates a blob file from the audiochunks data
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      //creates a playable URL from the blob file.
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudio(audioUrl);
      setAudioChunks([]);
    };
  };

  const handleSubmit = async () => {
    const audioBlob = await fetch(audio).then((r) => r.blob());
    const audioFile = new File([audioBlob], "voice.webm", { type: mimeType });

    // Now send the audio file to database!
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
  }, [timer, startTime]);

  return (
    <div>
      <h2>Audio Recorder</h2>
      <main>
        <div className="audio-controls">
          {!permission && (
            <button onClick={getMicrophonePermission} type="button">
              Get Microphone
            </button>
          )}
          {permission && recordingStatus === "inactive" ? (
            <button onClick={startRecording} type="button">
              Start Recording
            </button>
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
        {audio && (
          <div className="audio-container">
            <audio src={audio} controls></audio>
            <div>
              <a download href={audio}>
                Download Recording
              </a>
            </div>
            <input type="submit" onClick={handleSubmit} />
          </div>
        )}
      </main>
    </div>
  );
};
export default AudioCapture;
