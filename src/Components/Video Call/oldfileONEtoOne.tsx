import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "../../Context/WebsocketContext";
import { usePeer } from "../../Provider/Peer";

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
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await createAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket, createAnswer]
  );

  const handleCallAccepted = useCallback(
    async (data: { ans: RTCSessionDescriptionInit }) => {
      const { ans } = data;
      await peer.setRemoteDescription(ans);
      console.log("Call Accepted!");
      if (myStream) {
        console.log('Sending local stream to remote peer.');
        SendStream(myStream);
      } else {
        console.log('No local stream available to send.');
      }
    },
    [myStream, peer, SendStream]
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

  return (
    <div>
      <h1>Room Page</h1>
      {remoteEmailId}
      <h4>{remoteSocketId ? "Connected" : "No one in the room"}</h4>
      {remoteSocketId && <button onClick={handleCallUser}>CALL</button>}
      {myStream && (
        <>
          <h1>My Stream</h1>
          <video
            autoPlay
            playsInline
            muted
            height="100px"
            width="200px"
            ref={(videoElement) => {
              if (videoElement) {
                videoElement.srcObject = myStream;
              }
            }}
          />
        </>
      )}
      <video
        muted
        playsInline
        autoPlay
        ref={remoteVideoRef}
      ></video>
    </div>
  );
}

export default RoomVideoCall;
