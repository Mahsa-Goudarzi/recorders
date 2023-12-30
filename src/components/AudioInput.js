// https://fontawesomeicons.com/fa/react-js-audio-recorder

import { useState, useEffect, useRef } from "react";

export default function AudioInput() {
  const [outputText, setOutputText] = useState("Welcome to Audio Recorder");
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0); // Add timer state
  const audioChunksRef = useRef([]);
  const audioRecorderRef = useRef(null);

  const startRecording = async () => {
    audioChunksRef.current = [];
    setTimer(0); // Reset the timer
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioRecorderRef.current = new MediaRecorder(stream);

      audioRecorderRef.current.addEventListener("dataavailable", (e) => {
        audioChunksRef.current.push(e.data);
      });

      audioRecorderRef.current.start();
      setOutputText("We are recording now! Please start talking.");
      setIsRecording(true);

      // Start the timer
      const timerInterval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);

      audioRecorderRef.current.addEventListener("stop", () => {
        setIsRecording(false);
        clearInterval(timerInterval); // Stop the timer when recording ends
      });
    } catch (err) {
      console.error("Error: " + err);
    }
  };

  const stopRecording = () => {
    audioRecorderRef.current.stop();
    setOutputText(
      "The recording has ended! Just click the play button to listen."
    );
  };

  const playAudio = () => {
    // const blobObj = new Blob(audioChunksRef.current, { type: "audio/webm" });
    // const audioUrl = URL.createObjectURL(blobObj);
    // const audio = new Audio(audioUrl);
    // audio.play();
    setOutputText("Playing the recorded audio!");
  };

  const audioPlayer = () => {
    const blobObj = new Blob(audioChunksRef.current, { type: "audio/webm" });
    const audioUrl = URL.createObjectURL(blobObj);

    return (
      <audio controls>
        <source src={audioUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    );
  };

  useEffect(() => {
    if (audioRecorderRef.current) {
      audioRecorderRef.current.addEventListener("stop", () => {
        setIsRecording(false);
      });
    }
  }, []);

  return (
    <div className="container">
      <h3 className="heading">React Js Audio Recorder App</h3>
      <div className="button-container">
        <button
          className="record-button"
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
        <button className="play-button" onClick={playAudio}>
          Play back recording
        </button>
      </div>
      <p className="timer-text">Recording Time: {timer} seconds</p>
      <br />
      <div className="output" id="output">
        {outputText}
      </div>

      {outputText === "Playing the recorded audio!" && audioPlayer()}
      {/* <p>Audio input</p>
      <input type="file" accept="audio/*" capture /> */}
    </div>
  );
}
