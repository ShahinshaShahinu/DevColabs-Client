import { Chats } from "../../utils/interfaceModel/userInfra"
import { SendMessagess } from "../../utils/interfaceModel/userInfra"
import { api } from "../axios"


export const SendMessages = async (ReciverId: string, Message: Chats | undefined, Date: string) => {
    try {
        const res = await api.post('/sendMessage', { ReciverId, Message, Date }, { withCredentials: true })
        return res
    } catch (error) {

    }
}

export const Getchats = async () => {
    try {
        const data = await api.get('/Chats', { withCredentials: true })
        return data
    } catch (error) {

    }
}
export const ReadedPersonalChat = async (ChatId: string) => {
    try {
        const data = await api.post('/RadedPersonalMessage', { ChatId }, { withCredentials: true });
        return data
    } catch (error) {
        console.log(error);

    }
}
export const CreateCommunity = async (userId: string[], Name: string, Image: string, HashTag: string[], Date: string) => {
    try {
        const data = await api.post('/CreateCommunities', { userId, Name, Image, HashTag, Date }, { withCredentials: true })
        return data
    } catch (error) {
        console.log(error);
        return error
    }
}
export const AlreadyexistingCommunity = async (Name: string) => {
    try {
        const data = await api.post('/AlreadyexistingCommunity', { Name }, { withCredentials: true });
        return data
    } catch (error) {

    }
}
export const Communities = async () => {
    try {
        const data = await api.get('/Communities', { withCredentials: true });
        return data
    } catch (error) {
        console.log(error);

    }
}
export const RcomendedCommunities = async () => {
    try {
        const data = await api.get('/RecomendedCommunities', { withCredentials: true });
        return data

    } catch (error) {
        console.log(error);

    }
}
export const JoinCommunity = async (communityId: string) => {
    try {
        const res = await api.post('/JoinCommunity', { communityId }, { withCredentials: true });
        return res
    } catch (error) {
        console.log(error);
    }
}
export const SendCommunityMessage = async (Message: SendMessagess, id: string) => {
    try {
        const Sended = await api.post('/SendCommunityMessage', { Message, id }, { withCredentials: true });
        return Sended
    } catch (error) {

    }
}


export const ClearChat = async (CommunityId: string) => {
    try {
        await api.post('/clearChatCommunity', { CommunityId }, { withCredentials: true });

    } catch (error) {

    }
}


export const ChatNotificationPOST = async (ChatMessage: any, senderId: string) => {
    try {

        const SendedNotificaion = await api.post('/sendChatNotification', { ChatMessage, senderId }, { withCredentials: true });
        return SendedNotificaion
    } catch (error) {
        console.log(error);
    }
}