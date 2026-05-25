import { createSlice } from "@reduxjs/toolkit";

const userSlice=createSlice({
    name:"user",
    initialState:{
        userData:null,
        ignoredPatternsDirty: false
    },
    reducers:{
        setUserData:(state, action)=>{
            state.userData=action.payload
        },
        clearUserData: (state) => {
            state.userData = null
        },
        setIgnoredPatternsDirty: (state, action) => {
            state.ignoredPatternsDirty = action.payload
        }
    }
})

export const {setUserData, clearUserData, setIgnoredPatternsDirty}=userSlice.actions

export default userSlice.reducer