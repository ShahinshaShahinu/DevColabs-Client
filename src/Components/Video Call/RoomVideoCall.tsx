import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "../../Context/WebsocketContext";
import { usePeer } from "../../Provider/Peer";
import { MdCallEnd } from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface PeerContextValue {
  peer: RTCPeerConnection;
  createOffers: () => Promise<RTCSessionDescriptionInit>;
  createAnswer: (offer: RTCSessionDescriptionInit) => Promise<RTCSessionDescriptionInit>;
  SendStream: (stream: MediaStream) => Promise<void>;
  remoteStream: MediaStream | null;
}

interface Call {
  from: string;
  offer: RTCSessionDescriptionInit;
}

function RoomVideoCall() {
  const socket = useSocket();
  const naviagte= useNavigate()
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [remoteEmailId, setRemoteEmailId] = useState<string>('');
  const { peer, createOffers, createAnswer, SendStream, remoteStream }: PeerContextValue|any = usePeer();
  const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);

  const handleUserJoined = useCallback(({ email, id }: { email: string; id: string }) => {
    console.log(`Email ${email} joined room`);
    setRemoteEmailId(email);
    setRemoteSocketId(id);
  }, []);

  const handleIncomingCall = useCallback(
    async ({ from, offer }: Call) => {
      try {
        // Attempt to access media devices
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });

        // Continue with stream handling
        setRemoteSocketId(from);
        setMyStream(stream);
        SendStream(stream);
        const ans = await createAnswer(offer);
        socket.emit("call:accepted", { to: from, ans });
      } catch (error) {
        // Handle the error appropriately (e.g., show a message to the user)
        console.error('Error accessing media devices:', error);
      }
    },
    [socket, createAnswer]
  );

  const handleCallAccepted = useCallback(
    async (data: { ans: RTCSessionDescriptionInit }) => {
      const { ans } = data;
      await peer.setRemoteDescription(ans);
    },
    [peer]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await createOffers();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [createOffers, remoteSocketId, socket]);

  useEffect(() => {
    peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [peer, handleNegoNeeded]);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
    };
  }, [socket, handleUserJoined, handleIncomingCall, handleCallAccepted]);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await createOffers();
    await peer.setLocalDescription(offer);
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const remoteVideo = remoteVideoRef.current;
    if (remoteStream && remoteVideo) {
      remoteVideo.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    handleCallUser();
  }, [handleCallUser]);

  const handleEndCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: false,
      });
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Error stopping media devices:', error);
    }
  
    // Close the peer connection (assuming you have a 'peer' variable representing it)
    if (peer) {
      peer.close();
    }
  
   console.log('nnnnnnnnnnnnnnnnnnnn');
   
    naviagte('/videocall');
  };
  return (
    <div>
      <h1>Room Page</h1>
      {remoteEmailId}
      <h4>{remoteSocketId ? "Connected" : "No one in the room"}</h4>
  
      {myStream && (
        <>
          <h1 className="text-xl">My Stream</h1>
          <div className="flex justify-center items-center h-screen">
            <button onClick={()=>handleEndCall()}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full flex items-center"    >
              <MdCallEnd  className="text-3xl " />
            </button>
          </div>
          <video
            autoPlay
            playsInline
            // muted
            height="400px"
            width="400px"
            ref={(videoElement) => {
              if (videoElement) {
                videoElement.srcObject = myStream;
              }
            }}
          />
        </>
      )}
      <video
        // muted
        playsInline
        autoPlay
        // muted
        ref={remoteVideoRef}
      ></video>
    </div>
  );
}

export default RoomVideoCall;
