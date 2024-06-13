import mongoose, { mongo } from 'mongoose';
import { type } from 'os';

const subTodoSchema=new mongoose.Schema({
    Title:{
        type:String,
        required:true
    },
    Complete:{
        type:Boolean,
        default:false
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true});


export const subTodo=mongoose.model("subTodo",subTodoSchema);