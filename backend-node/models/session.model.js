import mongoose from "mongoose";

const sessionSchema=new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    url: {
        type: String,
        required: true
    },
    title: {
        type: String
    },
    domain: {
        type: String
    },
    timeSpent: {
        type: Number,
        required: true
    },
    openedAt: {
        type: String,
        required: true
    },
    closedAt: {
        type: String,
        required: true
    },
    extractedText: {
        type: String,
    }
}, {timestamps: true})


export const sessionModel=mongoose.model("Session", sessionSchema)