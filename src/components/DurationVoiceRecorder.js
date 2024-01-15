import ReactDurationRecorder from "react-duration-voice-recorder";

const DurationVoiceRecorder = () => {
  return (
    <ReactDurationRecorder
      getFile={(file) => console.log(file)}
      getUrl={(url) => console.log(url)}
      showPreview={true}
      timer={true}
      btnClass="your button classname"
      containerStyle={{
        width: "300px",
        border: "1px solid black",
        padding: "10px",
      }}
      duration={{
        hours: 0,
        minutes: 0,
        seconds: 30,
      }}
    />
  );
};

export default DurationVoiceRecorder;
