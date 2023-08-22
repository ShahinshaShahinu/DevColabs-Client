import { createSlice } from "@reduxjs/toolkit";


const INITIAL_STATE={
    adminId:"",
    adminUsername:"",
    adminImage:"",
    adminEmail:''
}
export const AdminSlice=createSlice({
    name:'Admin',
    initialState:INITIAL_STATE,
    reducers:{
        updateAdmin:(state,action)=>{
            state.adminId=action.payload.adminId
            state.adminImage=action.payload.adminImage
            state.adminUsername=action.payload.adminUsername
        }
    }
})

export const {updateAdmin} =AdminSlice.actions
export default AdminSlice.reducer