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
        const readed = await api.post('/ReadedNotification', { Read }, { withCredentials: true })
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
// export const UserData = async () => {
//     try {
//         const res = await api.get('/GetUserData', { withCredentials: true });
//         return res
//     } catch (error) {
//         console.log(error);

//     }
// }
export const UserFolowers = async () => {
    try {
        const res = await api.get('/userFollowers', { withCredentials: true });
        return res
    } catch (error) {
        console.log(error);

    }
}
export const Follow = async (FollowId: string) => {
    try {
        console.log(FollowId, 'FollowIdFollowIdFollowIdFollowId');

        const res = await api.put('/Follow', { FollowId }, { withCredentials: true });

        return res
    } catch (error) {
        console.log(error);

    }
}
export const UnFollow = async (UnFollowId: string) => {
    try {
        const res = await api.put('/UnFollow', { UnFollowId }, { withCredentials: true });

        return res
    } catch (error) {
        console.log(error);

    }
}

export const EditComment = async (data: string, PostCommentId: string) => {
    try {
        const res = await api.post('/EditComment', { data, PostCommentId }, { withCredentials: true });
        return res
    } catch (error) {

    }
}


export const FindHomePost = async () => {
    try {
        const res = await api.get('/HomePosts', { withCredentials: true });
        return res
    } catch (error) {
        console.log(error);

    }
}


export const DeletingPostHashtag = async (PostId: string, PosHashtag: string) => {
    try {
        const res = await api.post('/DeleteHashtag', { PostId, PosHashtag },{withCredentials:true});
        return res
    } catch (error) {
        console.log(error);

    }
}