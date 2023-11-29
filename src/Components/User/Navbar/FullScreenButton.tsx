import { useState } from 'react';
import { FaExpandAlt } from 'react-icons/fa';
import { MdOutlineCloseFullscreen } from 'react-icons/md';

const FullScreenButton = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      // Enter full screen
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement?.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    } else {
      // Exit full screen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }

    // Toggle the state
    setIsFullScreen(!isFullScreen);
  };

  return (
    <button
     type='button'
    
      className=" text-black text-xl px-2 py-2.5 rounded-md flex items-center"
      onClick={toggleFullScreen}
    >
      {isFullScreen ? (
        <>
          <MdOutlineCloseFullscreen title='normal screen' />
        </>
      ) : (
        <>
          <FaExpandAlt className=""  title='expand screen'/>
        </>
      )}
    </button>
  );
};

export default FullScreenButton;
