import { api } from "../axios"


export const getReportedPosts = async () => {

    const ReportedPosts = await api.get('/admin/ReportManageMent');
    return ReportedPosts
}


export const BlockReportedPost = async (PostId:string)=>{
     await api.post(`/admin/BlockReportedPost/${PostId}`);
}
export const UnBlockReportedPost = async (PostId:string)=>{
    await api.post(`/admin/UnBlockReportedPost/${PostId}`);
}

export const DeleteRePortPost = async (PostId:string)=>{
    try {
        api.post(`/DeletePost/${PostId}`, { withCredentials: true });
    } catch (error) {
        console.log(error);
        
    }
}