import {model , Schema} from 'mongoose';

//mongodb >> is a document-type
const messageSchema = new Schema({
    msgId: { type: Schema.Types.ObjectId, ref: 'Message', required: true},
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true}
},
    {timestamps: true}
    );

const schema = new Schema({
        participants: [{
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }],

        originalMessage: {
            type: Schema.Types.ObjectId,
            ref: "Message",
            required: true,
        },
    message : [messageSchema]
},
    {timestamps: true});
schema.index({ originalMessage: 1 }, { unique: true });
export const Conversation = model('Conversation', schema);

// o vs o model
/*{
  _id: "1234567",
  sender: "rtyuio89090",
  receiver: "5678yuio56789",
  messages:{
    {
      _id:"4738954895",
      msgId: "236789876",
      sender: "8987589898"
    }
  }
}
 * */