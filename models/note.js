import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:true,
    },
    slug:{
        type:String,
        unique:true,
        trim:true,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true,
    }, 
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },   
},{timestamps: true})

const NoteModel =
  mongoose.models.Note ||
  mongoose.model('Note', NoteSchema);


export default NoteModel;



