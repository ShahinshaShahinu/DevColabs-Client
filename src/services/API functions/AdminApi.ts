import { api } from "../axios"


export const getReportedPosts = async () => {

    const ReportedPosts = await api.get('/admin/ReportManageMent');
    return ReportedPosts
}


export const BlockReportedPost = async (PostId: string) => {
    await api.post(`/admin/BlockReportedPost/${PostId}`);
}
export const UnBlockReportedPost = async (PostId: string) => {
    await api.post(`/admin/UnBlockReportedPost/${PostId}`);
}

export const DeleteRePortPost = async (PostId: string) => {
    try {
        api.post(`/DeletePost/${PostId}`, { withCredentials: true });
    } catch (error) {
        console.log(error);

    }
}
export const DashbordDAtas =async ()=>{
    try {
        const Dashbord  = await api.get('/admin/DashbordDAta',{withCredentials:true});
        return Dashbord
    } catch (error) {
        console.log(error);
        
    }
}
export const ClearAll = async () =>{
    try {
        const res = await api.post('/admin/clearReportPosts');
        return res
    } catch (error) {
        
    }
}





export const SendNotification = async (message: string, notifyDate: string,ReportPostId:string,userId:string|undefined) => {
    try {
        await api.post('/sendNotification', { message, notifyDate ,ReportPostId,userId}, { withCredentials: true })
     
    } catch (error) {

    }
}





export const UserManageMentBlock = async (email: string) => {
    try {
        await api.post(`/admin/UserManageMent/Block/${email}`, { withCredentials: true });
    } catch (error) {
        console.log(error);
    }
}

export const UserManageMentUNBlock = async (email: string) => {
    try {
        await api.post(`/admin/UserManageMent/UnBloack/${email}`, { withCredentials: true });
    } catch (error) {
        console.log(error);
    }
}
