import { AiFillAudio, AiOutlineAudioMuted } from "react-icons/ai"
import { BsCameraVideoOffFill, BsFillCameraVideoFill } from "react-icons/bs"
import { MdCallEnd } from "react-icons/md"
import { usePeer } from "../../Provider/Peer";
import { useNavigate } from "react-router-dom";
import { useState } from "react";



interface FooterProps {
    VideoDisabled: (data: boolean) => void;
    AudioDiabled: (data: boolean) => void;
    stream: MediaStream | null | undefined
}
function VideoCallOptions({ VideoDisabled, AudioDiabled, stream }: FooterProps) {
    const [Audio, setAudio] = useState(true)
    const [video, setVido] = useState(true)
    const { peer }: any = usePeer();
    const naviagte = useNavigate()
    const handleEndCall = async () => {
        try {
           

            stream?.getTracks()?.forEach(track => track?.stop());
        } catch (error) {
            console.error('Error stopping media devices:', error);
        }

        // Close the peer connection (assuming you have a 'peer' variable representing it)
        if (peer) {
            peer.close();
        }

        naviagte('/videocall');
    };

    const CameraOFF = async () => {
 
        VideoDisabled(!video)
    }
    const OudioOFF = async () => {
        AudioDiabled(!Audio)
    }

    return (
        <>

            <div>
                <footer className="bg-gray-800  text-white p-4  fixed bottom-0 left-0 w-full">
                    <nav className="container mx-auto flex items-center justify-center">
                        <div className="">
                            <div className="flex space-x-12 justify-between">
                                <a className="hover:text-gray-400">
                                    {(video == true) ? (

                                        <BsCameraVideoOffFill onClick={() => { CameraOFF(), setVido(!video) }} className="text-2xl cursor-pointer" />
                                    ) : (
                                        <>
                                            <BsFillCameraVideoFill onClick={() => { CameraOFF(), setVido(!video) }} className="text-2xl cursor-pointer" />
                                        </>

                                    )}
                                </a>
                                <a className="hover:text-gray-400">
                                    {(Audio == true) ? (
                                        <>
                                            <AiOutlineAudioMuted onClick={() => { OudioOFF(), setAudio(!Audio) }} className="text-2xl  cursor-pointer" />
                                        </>
                                    ) : (<>
                                        <AiFillAudio onClick={() => { OudioOFF(), setAudio(!Audio) }} className="text-2xl cursor-pointer" />
                                    </>

                                    )}
                                </a>
                                <button
                                    onClick={handleEndCall}
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold px-2 p-1 rounded-full flex items-center"
                                >
                                    <MdCallEnd className="text-lg" />
                                </button>
                            </div>

                        </div>


                    </nav>
                </footer>
            </div>

        </>
    )
}

export default VideoCallOptions