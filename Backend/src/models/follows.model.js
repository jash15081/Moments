import mongoose, {Schema} from "mongoose"

const followSchema = new Schema({
    followedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    followedTo: {
        type: Schema.Types.ObjectId, 
        ref: "User"
    }
}, {timestamps: true})



export const Follows = mongoose.model("follows", followSchema)