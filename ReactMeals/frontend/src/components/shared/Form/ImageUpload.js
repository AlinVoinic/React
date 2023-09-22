import React, { useRef, useState, useEffect } from "react";

import "./ImageUpload.css";

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader(); // built-in browser API care ne ajuta sa parsam fisiere, le converteste din date binare in output readable
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview" onClick={pickImageHandler}>
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Alegeți o imagine.</p>}
        </div>
        {/* <span
          onClick={() => {
            setFile(null);
            setPreviewUrl(null);
            setIsValid(false);
          }}
        >
          `Deselectează documentul`
        </span> */}
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
