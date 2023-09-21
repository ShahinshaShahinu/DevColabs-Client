import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../Context/WebsocketContext";
import Navbar from "../User/Navbar/Navbar";
import { AiOutlineHome, AiOutlineUser } from "react-icons/ai";
import { HiOutlineUserGroup } from "react-icons/hi2";


function VideoCall() {
    const navigate  = useNavigate();
    const socket = useSocket();
    const [email, setEmail] = useState('');
    const [room, setRoom] = useState("");


    const handleJoinRoom = useCallback(
        (data: { email: string; room: string; }) => {
          const {  room } = data;
          navigate(`/room/${room}`);
        },
        [navigate]
      );
    
      useEffect(() => {
        socket.on("room:join", handleJoinRoom);
        return () => {
          socket.off("room:join", handleJoinRoom);
        };
      }, [socket, handleJoinRoom]);


    const handleSubmitForm = useCallback(
        (e: { preventDefault: () => void; }) => {
          e.preventDefault();
          socket.emit("room:join", { email, room });
        },
        [email, room, socket]
      );


    return (
        <>
          <div className=" relative z-20 ">
            <Navbar />
          </div>

          <div style={{ zIndex: '0' }}
                        className="">
                        <div className="hidden md:block mx-2 xl:mx-5 relative sm:w-66 md:w-82 lg:w-66 sm:w-72  md:w-ful xl:w-66 2xl:w-68">
                            <div className="fixed top-0 left-0 right-10  h-full hidden md:block  lg:max-w-[900px]  xl:w-[23rem] 2xl:w-[20 rem] md:w-[18rem] overflow-hidden lg:mx-7 xl:mx-10 md:mx-2 z-10">
                                <div className="h-full overflow-y-auto  relative bg-  border-r-2 px-2 ">
                                    <nav className="flex flex-col top-44 relative bg-white mr-3 border-2 p-2 pr-2 justify-around rounded-lg shadow-lg">
                                        <ul>
                                            <li onClick={() => navigate('/')} className="flex cursor-pointer items-center w-auto h-12 space-x-2 hover:bg-sky- rounded-xl hover:bg-sky-100">
                                                <AiOutlineHome className="text-3xl text-gray-800  ml-3 " />
                                                <h1 onClick={() => navigate('/')} className="font-bold text-base">Home</h1>
                                            </li>
                                            <li onClick={() => navigate('/Community')} className="flex cursor-pointer items-center h-12 space-x-2 hover:bg-sky-100 rounded-xl">
                                                <HiOutlineUserGroup className="text-3xl text-gray-800 ml-3 mr-1" />
                                                <h1 className="font-bold text-base">Community</h1>
                                            </li>
                                            <li onClick={() => navigate('/profile')} className="flex cursor-pointer items-center h-12 space-x-2 bg-sky-100 rounded-xl">
                                                <AiOutlineUser className="text-3xl text-gray-800 ml-3" />
                                                <h1 onClick={() => navigate('/profile')} className="font-bold text-base">Profile</h1>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>

            <div className="flex justify-center items-center h-screen">
                <form onSubmit={handleSubmitForm} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Enter Your Email
                        </label>
                        <input
                            id="email"
                            type="text"
                            required value={email} onChange={(e) => { setEmail(e?.target.value) }}
                            placeholder="Enter Email"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="roomCode" className="block text-gray-700 text-sm font-bold mb-2">
                            Enter Room Code
                        </label>
                        <input
                            id="roomCode"
                            type="text"
                            required value={room} onChange={(e) => setRoom(e.target.value)}
                            placeholder="Enter Room Code"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="text-center">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Enter Room
                        </button>
                    </div>
                </form>
            </div>

        </>
    )
}

export default VideoCall