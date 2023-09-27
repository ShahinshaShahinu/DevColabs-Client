import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "../../Context/WebsocketContext";
import { usePeer } from "../../Provider/Peer";
import Navbar from "../User/Navbar/Navbar";
import VideoCallOptions from "./VideoCallOptions";
import { useSelector } from "react-redux";

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
  const [Audio, setAudio] = useState(true);
  const { userId } = useSelector((state: any) => state.user);
  const [Video, setVido] = useState(true);
  const [frontCamera, setFrontCamera] = useState<boolean>(true);
  const handleUserJoined = useCallback(({ email, id }: { email: string; id: string }) => {
    // console.log(`Email ${email} joined room`);
    setRemoteEmailId(email);
    setRemoteSocketId(id);
  }, []);

  const handleIncomingCall = useCallback(
    async ({ from, offer }: Call) => {
      try {
        // Log the current frontCamera state
        console.log("frontCamera:", frontCamera);

        // Get the current camera stream based on the frontCamera state
        socket.on('changeCamera', (data) => {
          console.log(data, 'came');

          setFrontCamera(data)
        })

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: { facingMode: frontCamera ? 'user' : 'environment' },
        });

        // Log whether the front or rear camera was used
        console.log(frontCamera ? 'Using front camera' : 'Using rear camera');

        // Continue with stream handling
        setRemoteSocketId(from);
        setMyStream(stream);
        SendStream(stream);

        // Create an answer and emit it
        const ans = await createAnswer(offer);
        socket.emit("call:accepted", { to: from, ans });
      } catch (error) {
        // Handle the error appropriately (e.g., show a message to the user)
        // console.error("Error accessing media devices:", error);
      }
    },
    [createAnswer, socket, frontCamera]
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
  }, [socket, handleUserJoined, handleIncomingCall, handleCallAccepted, frontCamera]);

  const handleCallUser = useCallback(async () => {
    socket.on('changeCamera', async (data, Id) => {
      console.log(data, 'came');
      if (Id == userId) {
        setFrontCamera(data)
      } else {
        setFrontCamera(true);
        let stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: { facingMode: frontCamera ? 'user' : 'environment' },
        });
        setMyStream(stream);
      }
    })
    console.log(frontCamera ? 'Using front camera' : 'Using rear camera');
    let stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: { facingMode: frontCamera ? 'user' : 'environment' },
    });
    const offer = await createOffers();
    await peer.setLocalDescription(offer);
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket, frontCamera]);

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
      {/* <h4>{remoteSocketId ? "Connected" : "No one in the room"}</h4> */}
      <div>
        <h1>Room Page</h1>
        {remoteEmailId}
      </div>
      <div className="sm:top-12 top-10 sm:flex relative">
        <video
          // muted
          playsInline
          autoPlay
          // muted
          ref={remoteVideoRef}
        ></video>
        {myStream && (
          <>
            {Video ? (

              <video
                autoPlay
                playsInline
                height='500px'
                muted
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
      </div>

      <VideoCallOptions VideoDisabled={(data) => { setVido(data), turnOffCamera() }} setChangeCamera={(data) => setFrontCamera(data)} AudioDiabled={(data) => setAudio(data)} stream={myStream} />


    </>
  );
}

export default RoomVideoCall;