import { MediaHTMLAttributes, useEffect, useRef, useState } from "react";


function VoiceRecorder() {
    const [permission, setPermission] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const mediaRecorders = useRef<MediaStream | null>(null);
    // const [recording, setRecording] = useState(false);
    const [recordingStatus, setRecordingStatus] = useState<boolean | 'inactive' | 'recording'>("inactive");
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const [audio, setAudio] = useState<string>('');
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const getMicrophonePermission = async () => {
        if ("MediaRecorder" in window) {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    // video: false,
                });
                setPermission(true);
                setStream(streamData);
            } catch (err) {
                alert(err);
            }
        } else {
            alert("The MediaRecorder API is not supported in your browser.");
        }
    };

    useEffect(() => {
        if (stream && audioRef.current) {
            audioRef.current.srcObject = stream;
        }
    }, [])

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices?.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            recorder.ondataavailable = (e) => {
                if (e?.data?.size > 0) {
                    setAudioChunks([...audioChunks, e?.data]);
                }
            };
            recorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const url = URL.createObjectURL(audioBlob);
                setAudio(url);
            };
            recorder.start();
            // setRecording(true);
            setMediaRecorder(recorder);

        } catch (error) {
            console.error('Error starting recording:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder?.stop();
            // setRecording(false);
            
            stream?.getTracks()?.forEach(function (track) {
                track.stop();
                mediaRecorder?.stop();
            })
        }
    };
    const stopAudio = () => {
        try {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                stream?.getTracks()?.forEach(function (track) {
                    track.stop();
                mediaRecorder?.stop();})
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (audio) {
            // You can do something with the recorded audio URL here
        }
    }, [audio]);
    const sendAudio = () => {

        console.log("Sending audio:", audio);
    };


    return (
        <>
            {/* <button
                type="button" className="bg-blue-600 text-white p-2 md:p-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
                <svg className="w-5 h-5 text-white dark:text-gray-00 hover:text-gray-900 dark:hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7v3a5.006 5.006 0 0 1-5 5H6a5.006 5.006 0 0 1-5-5V7m7 9v3m-3 0h6M7 1h2a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3Z" />
                </svg>
            </button> */}

            <div>
                <main>
                    <div>
                        {/* <button
                                    onClick={startRecording}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                                > */}         {/* </button> */}
                        {!permission ? (
                            <button onClick={() => { getMicrophonePermission(); startRecording(); }}>
                                Start Recording
                            </button>
                        ) : (
                            <>
                                {/* <p className="bg-blue-700">Recording Started</p> */}
                                <button
                                    onClick={() => {
                                        stopRecording();
                                        // Optionally, you can call other functions or handle logic here
                                    }}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline-red active:bg-red-800"
                                >
                                    Stop Recording
                                </button>

                                <button
                                    onClick={stopAudio}
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline-green active:bg-green-800"
                                >
                                    Stop Audio
                                </button>

                                <button onClick={sendAudio} disabled={!audio}>
                                    Send Audio
                                </button>
                            </>
                        )}
                        {audio && <audio controls ref={audioRef} src={audio}></audio>}
                    </div>


                </main >

            </div >
        </>
    )
}

export default VoiceRecorder






{/* {permission && recordingStatus === "inactive" ? (
                            <button onClick={startRecording} type="button">
                                Start Recording
                            </button>
                        ) : null}
                        {recordingStatus === "recording" ? (
                            <button onClick={stopRecording} type="button">
                                Stop Recording
                            </button>
                        ) : null}
                        {permission ? (
                            <button type="button">
                                Record
                            </button>
                        ) : null} */}