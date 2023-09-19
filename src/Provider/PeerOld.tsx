// import React, { useMemo, ReactNode, useContext, useEffect, useState, useCallback } from 'react';

// // Define the type for the context value
// type PeerContextValue = {
//     peer: RTCPeerConnection;
//     createOffer: () => Promise<RTCSessionDescriptionInit>;
//     createAnswer: (offer: RTCSessionDescriptionInit) => Promise<RTCSessionDescriptionInit>;
  
//     SendStream: (stream: MediaStream) => Promise<void>;
//     remoteStream: MediaStream | null
// };

// const Peercontext = React.createContext<PeerContextValue | null>(null);
// export const usePeer = () => {
//     const context = useContext(Peercontext);

//     if (!context) {
//         throw new Error('usePeer must be used within a PeerProvider');
//     }
//     return context;
// };

// interface PeerProviderProps {
//     children: ReactNode;
// }

// export const PeerProvider: React.FC<PeerProviderProps> = ({ children }) => {
//     const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
//     const [peers, setPeers] = useState<RTCPeerConnection[]>([]);
//     const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);

//     const peer: RTCPeerConnection = useMemo(() => {
//         const configuration = {
//             iceServers: [{ urls: ["stun:stun.l.google.com:19302", "stun:global.stun.twilio.com:3478"] }]
//         };
//         return new RTCPeerConnection(configuration);
//     }, []);


//     const createOffer = async (peer: RTCPeerConnection): Promise<RTCSessionDescriptionInit> => {
//         const offer = await peer.createOffer();
//         await peer.setLocalDescription(offer);
//         return offer;
//     };


//     const createAnswer = async (peer: RTCPeerConnection, offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> => {
//         try {
//             await peer.setRemoteDescription(offer);
//             const answer = await peer.createAnswer();
//             await peer.setLocalDescription(answer);
//             return answer;
//         } catch (error) {
//             console.error('Error creating answer:', error);
//             throw error; // Rethrow the error for further handling
//         }
//     };


//     const SendStream = async (peer: RTCPeerConnection, stream: MediaStream): Promise<void> => {
//         const tracks = stream.getTracks();
//         const addedTracks = new Set<MediaStreamTrack>();
//         for (const track of tracks) {
//             if (!addedTracks.has(track)) {
//                 peer.addTrack(track, stream);
//                 addedTracks.add(track); // Mark the track as added
//             }
//         }
//     };

//     const handleTrackEvent = useCallback((ev: RTCTrackEvent) => {
//         const newStreams = [...remoteStreams];
//         const streams = ev?.streams;
//         if (streams && streams.length > 0) {
//             newStreams.push(streams[0]);
//             setRemoteStreams(newStreams);
//         }
//     }, [remoteStreams]);



//     useEffect(() => {
//         peer.forEach((peer: { addEventListener: (arg0: string, arg1: (ev: RTCTrackEvent) => void) => void; }) => {
//             peer.addEventListener('track', handleTrackEvent);
//         });

//         return () => {
//             peer.forEach((peer: { removeEventListener: (arg0: string, arg1: (ev: RTCTrackEvent) => void) => void; }) => {
//                 peer.removeEventListener('track', handleTrackEvent);
//             });
//         };
//     }, [peer, handleTrackEvent]);




//     const contextValue = useMemo(() => ({ peer, createOffer, createAnswer, SendStream, remoteStream }), [peer, createOffer, createAnswer, SendStream, remoteStream]);



//     return (
//         <Peercontext.Provider value={contextValue}>
//             {children}
//         </Peercontext.Provider>
//     );
// };


// // PeerProvider.tsx

// import React, { useMemo, ReactNode, useContext, useEffect, useState, useCallback } from 'react';

// // Define the type for the context value
// type PeerContextValue = {
//     peers: RTCPeerConnection[];
//     createOffer: (peer: RTCPeerConnection) => Promise<RTCSessionDescriptionInit>;
//     createAnswer: (peer: RTCPeerConnection, offer: RTCSessionDescriptionInit) => Promise<RTCSessionDescriptionInit>;
//     SendStream: (peer: RTCPeerConnection, stream: MediaStream) => Promise<void>;
//     remoteStreams: MediaStream[];
// };

// const Peercontext = React.createContext<PeerContextValue | null>(null);

// export const usePeer = () => {
//     const context = useContext(Peercontext);

//     if (!context) {
//         throw new Error('usePeer must be used within a PeerProvider');
//     }
//     return context;
// };

// interface PeerProviderProps {
//     children: ReactNode;
// }

// export const PeerProvider: React.FC<PeerProviderProps> = ({ children }) => {
//     const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);
//     const [peers, setPeers] = useState<RTCPeerConnection[]>([]);

//     const createPeer = useCallback(() => {
//         const configuration = {
//             iceServers: [{ urls: ["stun:stun.l.google.com:19302", "stun:global.stun.twilio.com:3478"] }]
//         };
//         const peer = new RTCPeerConnection(configuration);

//         // Set up event listeners and other peer configuration here as needed

//         return peer;
//     }, []);

//     const createOffer = async (peer: RTCPeerConnection): Promise<RTCSessionDescriptionInit> => {
//         const offer = await peer.createOffer();
//         await peer.setLocalDescription(offer);
//         return offer;
//     };

//     const createAnswer = async (peer: RTCPeerConnection, offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> => {
//         try {
//             await peer.setRemoteDescription(offer);
//             const answer = await peer.createAnswer();
//             await peer.setLocalDescription(answer);
//             return answer;
//         } catch (error) {
//             console.error('Error creating answer:', error);
//             throw error; // Rethrow the error for further handling
//         }
//     };

//     const SendStream = async (peer: RTCPeerConnection, stream: MediaStream): Promise<void> => {
//         const tracks = stream.getTracks();
//         const addedTracks = new Set<MediaStreamTrack>();
//         for (const track of tracks) {
//             if (!addedTracks.has(track)) {
//                 peer.addTrack(track, stream);
//                 addedTracks.add(track); // Mark the track as added
//             }
//         }
//     };

//     const handleTrackEvent = useCallback((ev: RTCTrackEvent) => {
//         const newStreams = [...remoteStreams];
//         const streams = ev?.streams;
//         if (streams && streams.length > 0) {
//             newStreams.push(streams[0]);
//             setRemoteStreams(newStreams);
//         }
//     }, [remoteStreams]);

//     useEffect(() => {
//         const peer = createPeer();
//         setPeers((prevPeers) => [...prevPeers, peer]);

//         peer.addEventListener('track', handleTrackEvent);

//         return () => {
//             peer.removeEventListener('track', handleTrackEvent);
//             peer.close();
//         };
//     }, [createPeer, handleTrackEvent]);

//     const contextValue = useMemo(() => ({ peers, createOffer, createAnswer, SendStream, remoteStreams }), [
//         peers,
//         createOffer,
//         createAnswer,
//         SendStream,
//         remoteStreams,
//     ]);

//     return <Peercontext.Provider value={contextValue}>{children}</Peercontext.Provider>;
// };
