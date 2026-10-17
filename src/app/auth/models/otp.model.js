import {model, Schema} from "mongoose";

const otpSchema = new Schema({
    code: {
        type: String,
        required :  true,
        length: 6,
    },
    email:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
  expiredAt:{
        type: Date,
      //tells MongoDB to create a TTL (Time To Live) index.
      //Automatically delete the document when its expiredAt time is reached.
        index : {expires:0}
  },


},
    {
        timestamps: true,
    }
)

// model

export const OTP = model("OTP", otpSchema);