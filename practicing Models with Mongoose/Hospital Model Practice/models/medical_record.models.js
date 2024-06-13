import mongoose from 'mongoose';

const medicalRecordSchema=new mongoose.Schema({

    patient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Patient'
    },
    
    doctor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Doctor'
    },

    CheckedAt:{
        type:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Hospital'
        }]
    }

},{timestamps:true}); 


export const Medical_Record=mongoose.model("Medical_Record",medicalRecordSchema);