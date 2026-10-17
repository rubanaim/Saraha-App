import {model, Schema} from 'mongoose';

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            minLength:3,
            maxLength:20,
            trim: true
        },
        email: {
            type: String,
            required : true,
            unique: true,
            lowercase : true,
            trim: true,
            validate: {
                validator :(value)=>{
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                },
                message : 'Please enter a vaild email'
            }
        },
        password : {
            type: String,
            required:
                function(){
                    return this.provider === 'local';

            },
            minLength: 6,
            validate:{
                validator: function(value){
                    return /[A-Z]/.test(value)&&/[a-z]/.test(value)&&/\d/.test(value);
              },
                message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
            }
        },
        provider :{
            type: String,
            enum: ['local','google','facebook','instagram'],
            default: 'local'
        },
        profilePic : String,
        isVerified : {
            type: Boolean,
            default :false
        },
        isDeleted:{
            type: Boolean,
            default: false
        },
    },
{
    timestamps: true ,// set createdAt and updatedAt
    strict: true,
}
);

export const User = model('User',userSchema);