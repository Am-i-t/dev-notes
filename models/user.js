import mongoose from 'mongoose';


const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        trim:true,
        lowercase: true,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        trim:true,
        required:true,
    },
},{timestamps:true})

const UserModel = mongoose.models.User || mongoose.model('User',UserSchema);

export default UserModel;