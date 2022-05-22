import React, { useEffect, useRef } from 'react';

const AudioPlayer = ({ stream }) => {
    let audio = useRef(new Audio());
    useEffect(() => {

    }, [])

    useEffect(() => {
        audio.srcObject = stream;
        audio.play();
    }, [stream, audio]);


    return (
        <div>AudioPlayer</div>
    );
};

export default AudioPlayer;
