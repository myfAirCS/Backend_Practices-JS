import mongoose from "mongoose";

const productSchemaWithQuantity=new mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Products"
    },
    quantity:{
        type:Number
    }
})

const ordersSchema=new mongoose.Schema({

    orderPrice:{
        type:Number,
        required:true
    },
    Product:{
        type:[productSchemaWithQuantity]
    },
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },

},{timestamps:true})


export const Orders = mongoose.model("Orders",ordersSchema);