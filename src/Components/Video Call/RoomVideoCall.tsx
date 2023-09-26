import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "../../Context/WebsocketContext";
import { usePeer } from "../../Provider/Peer";
import Navbar from "../User/Navbar/Navbar";
import VideoCallOptions from "./VideoCallOptions";

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
  const [myStream, setMyStream] = useState<MediaStream | null | undefined>(null);
  const [remoteEmailId, setRemoteEmailId] = useState<string>('');
  const { peer, createOffers, createAnswer, SendStream, remoteStream }: PeerContextValue | any = usePeer();
  const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
  const [Audio, setAudio] = useState(true)
  const [Video, setVido] = useState(true);

  const handleUserJoined = useCallback(({ email, id }: { email: string; id: string }) => {
    console.log(`Email ${email} joined room`);
    setRemoteEmailId(email);
    setRemoteSocketId(id);
  }, []);

  const handleIncomingCall = useCallback(
    async ({ from, offer }: Call) => {
      try {

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
    [createAnswer]
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
    let stream = await navigator.mediaDevices.getUserMedia({
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
  }, [handleCallUser, Video, Audio]);

  // const handleEndCall = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({
  //       audio: false,
  //       video: false,
  //     });
  //     stream.getTracks().forEach(track => track.stop());
  //   } catch (error) {
  //     console.error('Error stopping media devices:', error);
  //   }

  //   // Close the peer connection (assuming you have a 'peer' variable representing it)
  //   if (peer) {
  //     peer.close();
  //   }

  //   console.log('nnnnnnnnnnnnnnnnnnnn');

  //   naviagte('/videocall');
  // };

  const turnOffCamera = () => {
    if (myStream) {
      const tracks = myStream.getTracks();
      tracks.forEach((track) => {
        track.stop(); // This stops the individual track
      });
      setMyStream(null); 
    }
  };

  return (
    <>
      <div className=" relative z-20 ">
        <Navbar />
      </div>
      <div className="top-8 relative">
        <h1>Room Page</h1>
        {remoteEmailId}
        {/* <h4>{remoteSocketId ? "Connected" : "No one in the room"}</h4> */}

        {myStream && (
          <>
            <h1 className="text-xl">My Stream</h1>
            {Video ? (

              <video
                autoPlay
                playsInline
                // muted
                // height="400px"
                // width="400px"
                ref={(videoElement) => {
                  if (videoElement) {
                    videoElement.srcObject = myStream;
                  }
                }}
              />
            ) : (
              <div className="bg-black md:w-[42.8%] h-[42vh] " />
            )}



          </>
        )}
        <video
          // muted
          playsInline
          autoPlay
          // muted
          ref={remoteVideoRef}
        ></video>


        {/* <video
          autoPlay
          playsInline
          ref={(videoElement) => {
            if (videoElement && myStream) {
              videoElement.srcObject = myStream;
            }
          }}
        /> */}

      </div>

      <VideoCallOptions VideoDisabled={(data) => {setVido(data),turnOffCamera()}} AudioDiabled={(data) => setAudio(data)} stream={myStream} />


    </>
  );
}

export default RoomVideoCall;
