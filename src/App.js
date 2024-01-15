import { useState } from "react";
import ReactImagePicker from "./components/ReactImagePicker";
import ReactVideoRecorder from "./components/ReactVideoRecorder";
import ReactAudioRecorder from "./components/ReactAudioRecorder";
import "./App.css";
import DurationVoiceRecorder from "./components/DurationVoiceRecorder";

function App() {
  const [mode, setMode] = useState("image");
  return (
    <div className="App">
      <div>
        <button
          onClick={() => setMode("image")}
          style={{ backgroundColor: mode === "image" && "purple" }}
        >
          Image
        </button>

        <button
          onClick={() => setMode("video")}
          style={{ backgroundColor: mode === "video" && "purple" }}
        >
          Video
        </button>

        <button
          onClick={() => setMode("audio")}
          style={{ backgroundColor: mode === "audio" && "purple" }}
        >
          Audio
        </button>
      </div>
      <div>
        {mode === "image" && <ReactImagePicker />}
        {mode === "video" && <ReactVideoRecorder />}
        {mode === "audio" && <ReactAudioRecorder />}
        {/* {mode === "audio" && <DurationVoiceRecorder />} */}
      </div>
    </div>
  );
}

export default App;
