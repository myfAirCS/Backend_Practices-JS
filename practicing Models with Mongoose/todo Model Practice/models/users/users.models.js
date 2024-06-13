import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
        
        // required:[true,"Password is Required"]

        // Here We can also pass Array here in which we can write custom messages 
    },
},
{timestamps:true}
);

export const User =mongoose.model("User",userSchema);

// For createdAt and updatedAt we pass another object to the schema where we set {timestamps:true} 
// and this automatically handles the issue 




// This could also be used and it is simple. But, above approach is better as it gives us much more power
// and we can specify the Characteristics of that entity as well

// const userSchema = new mongoose.Schema({
//     username:String,
//     email:String
// });