import React, { useEffect, useRef } from 'react';

const VideoPlayer = ({ stream }) => {
    const videoRef = useRef();

    useEffect(() => {
        const videoObj = videoRef.current ? videoRef.current : videoRef;
        videoObj.srcObject = stream;
        videoObj.addEventListener('loadedmetadata', () => {
          videoObj.play();
        });
    }, [videoRef, stream]);

    return (
        <video ref={videoRef} muted></video>
    );
};

export default VideoPlayer;
