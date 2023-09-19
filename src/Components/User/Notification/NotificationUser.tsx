import { useEffect, useState } from "react";
import { useSocket } from "../../../Context/WebsocketContext";
import { Getchats } from "../../../services/API functions/CommunityChatApi";

function NotificationUser() {
    const [selectedChat, setSelectedChat] = useState<string[]|null>(null);
    const socket =useSocket()
    useEffect(() => {
        socket.on('chat', async () => {
            try {
                const datas = await Getchats();
                setSelectedChat(datas?.data?.[0]);
            } catch (error) {
                console.error('Error fetching chat data:', error);
            }
        });
    },[])

    return (
        <>


        </>
    )
}

export default NotificationUser