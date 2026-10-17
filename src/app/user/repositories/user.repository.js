import {User} from '../user.model.js';

export async function updateUserByEmail(email,newData){
    return User.findOneAndUpdate(
        {email:email},
        newData,
        //options : returns document after update
        {returnDocument: 'after'}
    );
}

export async function findUSerById(id){
    return User.findOne({_id:id, isDeleted: false}, {password: 0}, {});
    // return user.findById(id);
}