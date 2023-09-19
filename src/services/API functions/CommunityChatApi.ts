import { Chats } from "../../../../DevColab-Server/src/domain/models/Chats"
import { SendMessagess } from "../../../../DevColab-Server/src/domain/models/Community"
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
        console.log(data);

        return data

    } catch (error) {
        console.log(error);

    }
}
export const RcomendedCommunities = async () => {
    try {
        const data = await api.get('/RecomendedCommunities', { withCredentials: true });
        console.log(data);

        return data

    } catch (error) {
        console.log(error);

    }
}
export const JoinCommunity = async (communityId: string) => {
    try {
        console.log('joinnnnn');

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
        const data = await api.post('/clearChatCommunity', { CommunityId }, { withCredentials: true });
        console.log(data);

    } catch (error) {

    }
}


export const  ChatNotificationPOST =async (ChatMessage:any,senderId:string) =>{
    try {
       console.log('requested requested ');
       
       const SendedNotificaion = await api.post('/sendChatNotification',{ChatMessage,senderId},{withCredentials:true});
       return SendedNotificaion
    } catch (error) {
       console.log(error);
       
    }
   }