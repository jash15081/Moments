import mongoose,{mongo, Schema} from "mongoose";

const likesSchema = new Schema({
    likedBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    content:{
        type:Schema.Types.ObjectId,
        ref:"Post",
        required:true
    },
    
},
{
    timestamps:true
})

export const Likes = mongoose.model("Likes",likesSchema);