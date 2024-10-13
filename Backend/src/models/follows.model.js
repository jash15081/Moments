import mongoose, {Schema} from "mongoose"

const followSchema = new Schema({
    followedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index:true
    },
    followedTo: {
        type: Schema.Types.ObjectId, 
        ref: "User",
        index:true
    }
}, {timestamps: true})



export const Follows = mongoose.model("Follows", followSchema)