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
        markPatternsDirty: (state) => {
            state.ignoredPatternsDirty = true
        },
        markPatternsClean: (state) => {
            state.ignoredPatternsDirty = false
        }
    }
})

export const {setUserData, clearUserData, markPatternsDirty, markPatternsClean}=userSlice.actions

export default userSlice.reducer