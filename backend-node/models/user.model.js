import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    }
},{timestamps:true})


export const UserModel=mongoose.model("User", userSchema)