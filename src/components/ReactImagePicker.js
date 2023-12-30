import React, { useState } from "react";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";

//import ImagePreview from "./ImagePreview"; // source code : ./src/demo/ReactImagePickerWithImagePreview/ImagePreview

function ReactImagePicker() {
  const [dataUri, setDataUri] = useState("");

  function handleTakePhotoAnimationDone(dataUri) {
    console.log("takePhoto");
    setDataUri(dataUri);
  }

  const isFullscreen = false;
  return (
    <div>
      {dataUri ? (
        <img src={dataUri} alt="some pic" />
      ) : (
        <Camera
          onTakePhotoAnimationDone={handleTakePhotoAnimationDone}
          isFullscreen={isFullscreen}
        />
      )}
    </div>
  );
}

export default ReactImagePicker;
