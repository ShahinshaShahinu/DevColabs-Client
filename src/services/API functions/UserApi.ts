import { googleLogout } from "@react-oauth/google";
import { api } from "../axios";




export const UserBlock_UnBlock = async (userEmail: string) => {
    try {
        const { data } = await api.post(
            "/User",
            { userEmail },
            { withCredentials: true }
        );

        if (data?.user?.status == false) {

            localStorage.removeItem("user");
            googleLogout();

            return false
        } else {
            return true
        }


    } catch (error) {
        console.error("Error fetching user data:", error);
    }
};



export const DeletePostVideo = async (index: number, postId: string) => {
    try {
        const deleted = await api.post(`/deleteVideo/${index}/${postId}`);
        console.log(deleted, 'dele postvideo ');
        if (deleted) {
            return true
        } else {
            return false
        }

    } catch (error) {
        console.log(error, 'videodelete err');

    }
}

export const userRecomended = async () => {
    try {

        console.log('rec');
        const getUserHashtag = await api.get('/RecomendedPost');
        return getUserHashtag
    } catch (error) {
        console.log(error, 'errr');
    }
}

export const GetNotification = async () => {
    try {
        const allNotification = await api.get('/Notification', { withCredentials: true })
        return allNotification;
    } catch (error) {
        console.log(error);

    }
}

export const Readed = async () => {
    try {
        const Read = true
       const readed= await api.post('/ReadedNotification', { Read }, { withCredentials: true })
       console.log(readed);
       return readed
       
    } catch (error) {
        console.log(error);

    }
}

export const DeletNotification = async () => {
    try {
        const response = await api.post('/DeletNotification', { withCredentials: true })
        return response
    } catch (error) {
        console.log(error);

    }
}

export const GetUsers = async () => {
    try {
        const allUsersResponse = await api.get(`/GetUsers`, { withCredentials: true });
        return allUsersResponse
    } catch (error) {
        console.log(error);

    }
}