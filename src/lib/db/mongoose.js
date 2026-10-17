import mongoose from 'mongoose';
import {env} from '../config/env.js';

function connectToDB(){
    mongoose.connect(env.db.url);
}

export default connectToDB;