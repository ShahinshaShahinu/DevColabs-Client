import React, { useMemo, ReactNode, useContext, useEffect, useState, useCallback } from 'react';

// Define the type for the context value
type PeerContextValue = {
    peer: RTCPeerConnection;
    createOffers: () => Promise<RTCSessionDescriptionInit>;
    createAnswer: (offer: RTCSessionDescriptionInit) => Promise<RTCSessionDescriptionInit>;
  
    SendStream: (stream: MediaStream) => Promise<void>;
    remoteStream: MediaStream | null
};

const Peercontext = React.createContext<PeerContextValue | null>(null);
export const usePeer = () => {
    const context = useContext(Peercontext);

    if (!context) {
        throw new Error('usePeer must be used within a PeerProvider');
    }
    return context;
};

interface PeerProviderProps {
    children: ReactNode;
}

export const PeerProvider: React.FC<PeerProviderProps> = ({ children }) => {
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const peer: RTCPeerConnection = useMemo(() => {
        const configuration = {
            iceServers: [{ urls: ["stun:stun.l.google.com:19302", "stun:global.stun.twilio.com:3478"] }]
        };
        return new RTCPeerConnection(configuration);
    }, []);


    const createOffers = async (): Promise<RTCSessionDescriptionInit> => {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        return offer;
    };

    const createAnswer = async (offer: RTCSessionDescriptionInit) => {
        try {
            
            await peer.setRemoteDescription(offer);
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);
            return answer
        } catch (error) {
            console.error('Error creating answer:', error);
            throw error; // Rethrow the error for further handling
        }
    }



    const SendStream = async (stream: MediaStream) => {
        const tracks = stream.getTracks();
        const addedTracks = new Set<MediaStreamTrack>();
        for (const track of tracks) {
            if (!addedTracks.has(track)) {
                peer.addTrack(track, stream);
                addedTracks.add(track); // Mark the track as added
            }
        }

    }

    const handleTrackEvent = useCallback((ev: RTCTrackEvent) => {
        const streams = ev?.streams;
        if (streams && streams.length > 0) {
            setRemoteStream(streams[0]);
        } else {
            console.log('No remote streams found in RTCTrackEvent');
        }
    }, []);




    useEffect(() => {

        peer.addEventListener('track', handleTrackEvent);

        return () => {
            peer?.removeEventListener('track', handleTrackEvent);
        }
    }, [peer, handleTrackEvent, SendStream]);




    const contextValue = useMemo(() => ({ peer, createOffers, createAnswer, SendStream, remoteStream }), [peer, createOffers, createAnswer, SendStream, remoteStream]);



    return (
        <Peercontext.Provider value={contextValue}>
            {children}
        </Peercontext.Provider>
    );
};
