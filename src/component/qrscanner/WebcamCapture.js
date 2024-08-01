import React, { useEffect, useRef } from "react";
import Webcam from "react-webcam";

const WebcamCapture = ({ onScan }) => {
    const webcamRef = useRef(null);

    useEffect(() => {
        const timer = setInterval(() => {
            capture();
        }, 500);
        return () => clearInterval(timer); // Proper cleanup
    }, []);

    const videoConstraints = {
        width: 300,
        height: 300,
        facingMode: "environment"
    };

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        onScan(imageSrc);
    };

    return (
        <div>
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                onClick={() => capture()}
            />
        </div>
    );
};

export default WebcamCapture;
