import mongoose,{Schema} from "mongoose";

const NotificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User', 
    },
    message: {
      type: String,
      required: true,
    },
    avatar:{
        type:String,
        required:true
    }
  },
  {
    timestamps: true, 
  }
);

export const Notification = mongoose.model('Notification', NotificationSchema);


