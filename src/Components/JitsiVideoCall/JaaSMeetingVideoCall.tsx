import { JaaSMeeting } from '@jitsi/react-sdk';
import { useSelector } from 'react-redux';


function JaaSMeetingVideoCall() {
    const { username, userEmail }: string | any = useSelector((state: any) => state?.user);


    const roomName = 'DevCollab Meet'; // Replace with your desired room name


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
        displayName: username,
        email: userEmail,
    };


    return (
        <>
            <JaaSMeeting
                appId={'meet.jit.si'}
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
