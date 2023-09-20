import { JaaSMeeting } from '@jitsi/react-sdk';

function JaaSMeetingVideoCall() {
    const roomName = 'PleaseUseAGoodRoomName'; // Replace with your desired room name

    const configOverwrite = {
        startWithAudioMuted: true,
        disableModeratorIndicator: true,
        startScreenSharing: true,
        enableEmailInStats: false,
    };

    const interfaceConfigOverwrite = {
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
    };

    const userInfo = {
        displayName: 'YOUR_USERNAME', // Replace with the desired username
        email: '', // Include an empty email or a placeholder value
    };

    // const appId = 'localhost:5173'; // Replace with your local server address

    return (
        <>
            <JaaSMeeting
                appId={'https://dev-colabs-client.vercel.app/jasMeetingVideoCall'}
                roomName={roomName}
                configOverwrite={configOverwrite}
                interfaceConfigOverwrite={interfaceConfigOverwrite}
                userInfo={userInfo}
                onApiReady={() => {
                    // Here you can attach custom event listeners to the Jitsi Meet External API
                    // You can also store it locally to execute commands
                }}
                getIFrameRef={(iframeRef) => {
                    if (iframeRef) {
                        iframeRef.style.height = '700px';
                    }
                }}
            />
        </>
    );
}

export default JaaSMeetingVideoCall;
