import { AiFillAudio, AiOutlineAudioMuted } from "react-icons/ai"
import { BsCameraVideoOffFill, BsFillCameraVideoFill } from "react-icons/bs"
import { FaCameraRotate } from "react-icons/fa6"
import { MdCallEnd } from "react-icons/md"
import { usePeer } from "../../Provider/Peer";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSocket } from "../../Context/WebsocketContext";
import { useSelector } from "react-redux";




interface FooterProps {
    VideoDisabled: (data: boolean) => void;
    AudioDiabled: (data: boolean) => void;
    setChangeCamera: (data: boolean) => void;
    stream: MediaStream | null | undefined
}
function VideoCallOptions({ VideoDisabled, AudioDiabled, stream, setChangeCamera }: FooterProps) {
    const [Audio, setAudio] = useState(true);
    const { userId } = useSelector((state: any) => state.user);
    const socket = useSocket();
    const [video, setVido] = useState(true);
    const [frontCamera, setFrontCamera] = useState<boolean>(true);
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
    const changeCamera = async () =>{
        socket.emit('changeCamera',frontCamera,userId)
    }

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
                            <div className="flex space-x-8 justify-between">
                                <a className="hover:text-gray-400 font-bold py-2  rounded-full mb-2">
                                    {(video == true) ? (

                                        <BsCameraVideoOffFill onClick={() => { CameraOFF(), setVido(!video) }} className="text-2xl cursor-pointer" />
                                    ) : (
                                        <>
                                            <BsFillCameraVideoFill onClick={() => { CameraOFF(), setVido(!video) }} className="text-2xl cursor-pointer" />
                                        </>

                                    )}
                                </a>
                                <a className="hover:text-gray-400  relative font-bold py-2  rounded-full mb-2">
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
                                    className="bg-red-500 hover:bg-red-600 text-white  font-bold py-2 px-4 rounded-full mb-2  "
                                >
                                    <MdCallEnd className="text-2xl" />
                                </button>
                                <div className="flex  sm:hidden  relative">
                                    {frontCamera ? (
                                        <button onClick={() => { setChangeCamera(!frontCamera),changeCamera(), setFrontCamera(!frontCamera) }} className=" rounded-full " >
                                            <FaCameraRotate className="text-3xl" />
                                        </button>
                                    ) : (
                                        <button onClick={() => { setChangeCamera(!frontCamera),changeCamera(), setFrontCamera(!frontCamera) }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mb-2">
                                            <FaCameraRotate className="text-2xl" />
                                        </button>
                                    )}
                                </div>



                            </div>

                        </div>


                    </nav>
                </footer>
            </div>

        </>
    )
}

export default VideoCallOptions