import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../Context/WebsocketContext";


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