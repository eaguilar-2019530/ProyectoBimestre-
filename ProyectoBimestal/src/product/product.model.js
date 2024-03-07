import { mongoose, Schema } from "mongoose";

const productSchema = mongoose.Schema({
    nameProduct: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    stock: {
        type: String,
        required: true
    },
     category:{
        type: Schema.ObjectId,
        ref: 'category',
        required: true
    },
    cont: {
        type: Number,
        default: 0
    },
    state: {
        type: Boolean,
        default: true
    }
})

export default mongoose.model('product', productSchema)