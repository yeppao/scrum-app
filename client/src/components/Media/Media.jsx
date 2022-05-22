import React from 'react';
import AudioPlayer from '@components/Media/AudioPlayer';
import VideoPlayer from '@components/Media/VideoPlayer';

const Media = ({ stream, type }) => {
    let component = null;
    switch (type) {
        case 'audio':
            component = <AudioPlayer stream={stream} />
            break;
        case 'video':
            component = <VideoPlayer stream={stream} />
            break;
        default:
            console.log('Media type not handled', type);
    }

    return component;
};

export default Media;
