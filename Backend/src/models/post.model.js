import mongoose,{Schema} from "mongoose";

const postSchema = new Schema(
    {
        media:{
            type:String,
            required:true,
        },
        mediaType:{
            type:String,
            required:true,
            enum:["image","video"]
        },
        caption:{
            type:String,
            default:""
        },
        createdBy:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
            
        },
        shares:{
            type:Number,
            default:0
        }
    }
    ,{
        timestamps:true
    }
)

export const Post = mongoose.model("Post",postSchema);